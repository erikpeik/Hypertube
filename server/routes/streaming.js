module.exports = (app, fs, path, axios, pool) => {

	const getMagnetLink = (hash, torrent_url, film_title) => {
		return `magnet:?xt=urn:btih:${hash}&dn=${film_title.split(' ').join('+')}`
	}

	const downloadTorrent = async (magnet_link, imdb_id) => new Promise((resolve) => {
		let torrentStream = require('torrent-stream');

		let videoPath = path.resolve(__dirname, '../movies')
		console.log("Downloading files to: ", videoPath)

		let options = {
			path: videoPath, // Where to save the files. Overrides `tmp`.
		}
		let engine = torrentStream(magnet_link, options);

		let files = []

		engine.on('ready', () => {
			engine.files.forEach(async (file) => {
				if (file.name.endsWith('.mp4') || file.name.endsWith('.srt')) {
					files.push({ name: file.name, path: file.path, size: file.length })
					console.log("Now downloading: " + file.name);
					file.select(file.name)

					let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND path = $2`
					const { rows } = await pool.query(sql, [imdb_id, `movies/${file.path}`])

					if (rows.length === 0) {
						sql = `INSERT INTO downloads (path, file_type, file_size, imdb_id) VALUES ($1,$2,$3,$4)`
						pool.query(sql, [`movies/${file.path}`, file.name.slice(-3), file.length, imdb_id])
					}
				}
			})
		})

		engine.on('download', () => {
			console.log("Downloading...")
			resolve(files)
		})

		engine.on('idle', (files) => {
			console.log("All files downloaded");

			sql = `UPDATE downloads SET completed = 'YES' WHERE imdb_id = $1`
			pool.query(sql, [imdb_id])

			engine.destroy(() => {
				console.log("Engine connection destroyed");
			})
		})
	})

	app.get('/api/moviestream/:id', async (request, response) => {
		const id = request.params.id

		let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND file_type = 'mp4'`
		const { rows } = await pool.query(sql, [id])

		let moviefile
		if (rows.length > 0)
			moviefile = rows[0]['path']
		else
			moviefile = `movies/pushthebutton.mp4`

		const fileSize = fs.statSync(moviefile).size
		const range = request.headers.range
		if (range) {
			console.log("Requested Movie Range: ", range)
			const parts = range.replace(/bytes=/, "").split("-")
			const start = parseInt(parts[0], 10)
			const end = parts[1]
				? parseInt(parts[1], 10)
				: fileSize - 1
			const chunksize = (end - start) + 1
			const videoStream = fs.createReadStream(moviefile, { start, end })
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
			}
			response.writeHead(206, head);
			videoStream.pipe(response);
		} else {
			console.log("No Movie Range Defined")
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
			}
			response.writeHead(200, head)
			const videoStream = fs.createReadStream(moviefile)
			videoStream.pipe(response)
		}
	})

	app.post('/api/streaming/torrent/:id', async (request, response) => {
		const imdb_id = request.params.id

		let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND file_type = 'mp4'`
		const { rows } = await pool.query(sql, [imdb_id])

		let responseSent = false

		if (rows.length > 0 && rows[0]['completed'] === 'YES')
			return response.status(200).send(`Ready to play`)
		else if (rows.length > 0 && fs.existsSync(rows[0]['path']) && fs.statSync(rows[0]['path']).size > 50000000) {
			response.status(200).send(`Ready to play`)
			responseSent = true
		}

		const APIInfo = await axios.get(`${process.env.TORRENT_API}?query_term=${imdb_id}`)

		let torrentInfo = APIInfo.data.data.movies[0].torrents

		console.log("Film ID: ", imdb_id)
		console.log("Torrent info: ", torrentInfo)

		if (torrentInfo.length > 1)
			torrentInfo.sort((a, b) => (a.seeds > b.seeds ? -1 : 1))

		let film_title = APIInfo.data.data.movies[0].title_long
		let hash = torrentInfo[0].hash
		let torrent_url = torrentInfo[0].url

		let magnet_link = getMagnetLink(hash, torrent_url, film_title)

		let torrent_files = await downloadTorrent(magnet_link, imdb_id)
		console.log("Torrent files: ", torrent_files)

		console.log(fs.existsSync(`movies/${torrent_files[0].path}`))
		while (fs.existsSync(`movies/${torrent_files[0].path}`) === false)
			await new Promise(r => setTimeout(r, 1000));
		console.log(fs.existsSync(`movies/${torrent_files[0].path}`))

		fs.watch(`movies/${torrent_files[0].path}`, (curr, prev) => {
			fs.stat(`movies/${torrent_files[0].path}`, (err, stats) => {
				if (stats.size > 50000000 && responseSent === false) {
					console.log(stats.size)
					// if (stats.size > torrent_files[0].size / 10 && responseSent === false) {
					response.status(200).send(`Ready to play`)
					responseSent = true
				}
			})
		})
	})

};

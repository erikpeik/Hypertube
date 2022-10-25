module.exports = (app, fs, path, axios) => {

	const getMagnetLink = (hash, torrent_url, film_title) => {
		return `magnet:?xt=urn:btih:${hash}&dn=${film_title.split(' ').join('+')}`
	}

	const downloadTorrent = async (magnet_link) => new Promise((resolve) => {
		let torrentStream = require('torrent-stream');

		let videoPath = path.resolve(__dirname, '../movies')
		console.log("Downloading files to: ", videoPath)

		let options = {
			path: videoPath, // Where to save the files. Overrides `tmp`.
		}
		let engine = torrentStream(magnet_link, options);

		let files = []

		engine.on('ready', () => {
			engine.files.forEach(file => {
				if (file.name.endsWith('.mp4') || file.name.endsWith('.srt')) {
					let fileName = file.name;
					let filePath = file.path;
					let fileSize = file.length;
					files.push({ name: fileName, path: filePath, size: fileSize })
					console.log("We WOULD now download: " + fileName);
					// file.select(file.name)
				}
			})
		})

		engine.on('download', () => {
			console.log("Downloading...")
			resolve(files)
		})

		engine.on('idle', (files) => {
			console.log("All files downloaded");
			engine.destroy(() => {
				console.log("Engine connection destroyed");
			})
		})
	})

	app.get('/api/moviestream/:id', (request, response) => {
		const id = request.params.id

		const moviefile = `movies/${id}.mp4`

		const stats = fs.statSync(moviefile)
		const fileSize = stats.size
		const range = request.headers.range
		if (range) {
			console.log("Requested Movie Range: ", range)
			const parts = range.replace(/bytes=/, "").split("-")
			const start = parseInt(parts[0], 10)
			const end = parts[1]
				? parseInt(parts[1], 10)
				: fileSize - 1
			const chunksize = (end - start) + 1
			const file = fs.createReadStream(moviefile, { start, end })
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
			}
			response.writeHead(206, head);
			file.pipe(response);
		} else {
			console.log("No Movie Range Defined")
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
			}
			response.writeHead(200, head)
			const readStream = fs.createReadStream(moviefile)
			readStream.pipe(response)
		}
	})

	app.post('/api/streaming/torrent/:id', async (request, response) => {
		const imdb_id = request.params.id
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

		let torrent_files = await downloadTorrent(magnet_link)
		console.log("Torrent files: ", torrent_files)

		let responseSent = false

		await new Promise(r => setTimeout(r, 5000));

		fs.watch(`movies/${torrent_files[0].path}`, (curr, prev) => {
			fs.stat(`movies/${torrent_files[0].path}`, (err, stats) => {
				if (stats.size > 100000000 && responseSent === false) {
					console.log(stats.size)
				// if (stats.size > torrent_files[0].size / 10 && responseSent === false) {
					response.status(200).send(`Ready to play film ${film_title}`)
					responseSent = true
				}
			})
		})

	})

};

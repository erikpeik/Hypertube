module.exports = (app, fs, path, axios, pool) => {
	const getMagnetLink = (torrentInfo, film_title) => {
		let hash = torrentInfo.hash;
		let torrent_url = torrentInfo.url;

		return `magnet:?xt=urn:btih:${hash}&dn=${film_title.split(" ").join("+")}`;
	};

	const downloadTorrent = async (magnet_link, imdb_id) =>
		new Promise((resolve) => {
			let torrentStream = require("torrent-stream");

			let videoPath = path.resolve(__dirname, "../movies");
			console.log("Downloading files to: ", videoPath);

			let options = {
				trackers: [
				'udp://tracker.opentrackr.org:1337',
				'udp://9.rarbg.com:2810',
				'udp://tracker.openbittorrent.com:80',
				'udp://tracker.openbittorrent.com:6969',
				'udp://opentracker.i2p.rocks:6969',
				'udp://tracker.torrent.eu.org:451',
				'udp://open.stealth.si:80',
				'udp://vibe.sleepyinternetfun.xyz:1738',
				'udp://tracker2.dler.org:80',
				'udp://tracker1.bt.moack.co.kr:80',
				'udp://tracker.zerobytes.xyz:1337',
				'udp://tracker.tiny-vps.com:6969',
				'udp://tracker.theoks.net:6969',
				'udp://tracker.swateam.org.uk:2710',
				'udp://tracker.publictracker.xyz:6969',
				'udp://tracker.monitorit4.me:6969',
				'udp://tracker.moeking.me:6969',
				'udp://tracker.lelux.fi:6969',
				'udp://tracker.encrypted-data.xyz:1337',
				],
				path: videoPath, // Where to save the files. Overrides `tmp`.
			};
			let engine = torrentStream(magnet_link, options);

			let files = [];

			engine.on("ready", () => {
				engine.files.forEach(async (file) => {
					if (
						file.name.endsWith(".mp4") ||
						file.name.endsWith(".srt")
					) {
						files.push({
							name: file.name,
							path: file.path,
							size: file.length,
						});
						console.log("Now downloading: " + file.name);
						file.select();

						let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND path = $2`;
						const { rows } = await pool.query(sql, [
							imdb_id,
							`movies/${file.path}`,
						]);

						if (rows.length === 0) {
							sql = `INSERT INTO downloads (path, file_type, file_size, imdb_id) VALUES ($1,$2,$3,$4)`;
							pool.query(sql, [
								`movies/${file.path}`,
								file.name.slice(-3),
								file.length,
								imdb_id,
							]);
						}
					}
				});
			});

			engine.on("download", () => {
				console.log("Downloading...");
				resolve(files);
			});

		engine.on('idle', (files) => {
			console.log("All files downloaded");

			sql = `UPDATE downloads SET completed = 'YES' WHERE imdb_id = $1`
			pool.query(sql, [imdb_id])

			engine.destroy(() => {
				console.log("Engine connection destroyed");
			})
		})
	})

	app.get("/api/moviestream/:id", async (request, response) => {
		const id = request.params.id;

		let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND file_type = 'mp4'`;
		const { rows } = await pool.query(sql, [id]);

		let moviefile;
		if (rows.length > 0) moviefile = rows[0]["path"];
		else moviefile = `movies/pushthebutton.mp4`;

		const fileSize = fs.statSync(moviefile).size
		const range = request.headers.range
		if (range) {
			console.log("Requested Movie Range: ", range)
			const CHUNK_SIZE = 10 ** 6;
			const start = Number(range.replace(/\D/g, ""))
			const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
			const contentLength = (end - start) + 1
			const head = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": contentLength,
				"Content-Type": "video/mp4"
			};
			response.writeHead(206, head);
			const videoStream = fs.createReadStream(moviefile, { start, end })
			videoStream.pipe(response);
		} else {
			console.log("No Movie Range Defined");
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
			}
			response.writeHead(200, head)
			const videoStream = fs.createReadStream(moviefile)
			videoStream.pipe(response)
		}
	})

	app.post("/api/streaming/torrent/:id", async (request, response) => {
		const imdb_id = request.params.id;

		let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND file_type = 'mp4'`;
		const { rows } = await pool.query(sql, [imdb_id]);

		let responseSent = false;

		if (rows.length > 0 && rows[0]["completed"] === "YES")
			return response.status(200).send(`Ready to play`);
		else if (
			rows.length > 0 &&
			fs.existsSync(rows[0]["path"]) &&
			fs.statSync(rows[0]["path"]).size > 50000000
		) {
			response.status(200).send(`Ready to play`);
			responseSent = true;
		}

		const movieInfo = await axios.get(
			`${process.env.TORRENT_API}?query_term=${imdb_id}`
		).then(response => response.data.data.movies[0]);

		let torrentInfo = movieInfo.torrents;
		let film_title = movieInfo.title_long;

		if (torrentInfo.length > 1)
			torrentInfo.sort((a, b) => (a.seeds > b.seeds ? -1 : 1));

		let magnet_link = getMagnetLink(torrentInfo[0], film_title);

		let torrent_files = await downloadTorrent(magnet_link, imdb_id);
		console.log("Torrent files: ", torrent_files);

		while (fs.existsSync(`movies/${torrent_files[0].path}`) === false)
			await new Promise(r => setTimeout(r, 1000));

		fs.watch(`movies/${torrent_files[0].path}`, (curr, prev) => {
			fs.stat(`movies/${torrent_files[0].path}`, (err, stats) => {
				if (stats.size > 50000000 && responseSent === false) {
					console.log(stats.size);
					// if (stats.size > torrent_files[0].size / 10 && responseSent === false) {
					response.status(200).send(`Ready to play`);
					responseSent = true;
				}
			});
		});
	});
};

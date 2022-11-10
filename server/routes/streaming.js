module.exports = (app, fs, path, axios, pool, ffmpeg) => {
	let torrentStream = require("torrent-stream");
	let qualityList = ['720p', '1080p', '2160p', '3D']
	let subtitleLanguages = ["en", "fi"]

	const getMagnetLink = (torrentInfo, film_title) => {
		let hash = torrentInfo.hash;
		let torrent_url = torrentInfo.url;

		return `magnet:?xt=urn:btih:${hash}&dn=${film_title.split(" ").join("+")}`;
	};

	const downloadTorrent = async (magnet_link, imdb_id, quality) =>
		new Promise((resolve) => {
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
					if (file.name.endsWith(".mp4") || file.name.endsWith(".mkv")) {
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
							sql = `INSERT INTO downloads (path, file_type, file_size, imdb_id, quality) VALUES ($1,$2,$3,$4,$5)`;
							pool.query(sql, [
								`movies/${file.path}`, file.name.slice(-3), file.length, imdb_id, quality]);
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

				sql = `UPDATE downloads SET completed = 'YES' WHERE imdb_id = $1 AND quality = $2`
				pool.query(sql, [imdb_id, quality])

				engine.destroy(() => {
					console.log("Engine connection destroyed");
				})
			})
		})

	app.get("/api/moviestream/:id/:quality", async (request, response) => {
		const id = request.params.id;
		const quality = request.params.quality;
		let notLoaded = false;

		if (!qualityList.includes(quality))
			return response.send("Invalid movie quality")

		let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND quality = $2`;
		const { rows } = await pool.query(sql, [id, quality]);
		if (rows.length === 0)
			return response.send("Faulty Movie ID or quality")

		let moviefile;
		if (rows.length > 0) moviefile = rows[0]["path"];
		else moviefile = `movies/pushthebutton.mp4`;

		const isMp4 = ((rows[0]["file_type"] === 'mp4' && moviefile.includes("YTS")) || rows[0]["completed"] === 'YES')

		const fileSize = Number(rows[0].file_size)
		const range = request.headers.range
		if (!range) {
			response.status(404).send('Requires Range header');
		} else {
			console.log("Requested Movie Range: ", range)
			const CHUNK_SIZE = 10 ** 6;
			let start = Number(range.replace(/\D/g, ''))
			if (start > fileSize - 1) {
				notLoaded = true;
				start = 0;
			}
			const end = isMp4 ? Math.min(start + CHUNK_SIZE, fileSize - 1) : fileSize - 1
			const contentLength = (end - start) + 1
			const head = isMp4
				? {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": contentLength,
					"Content-Type": "video/mp4"
				}
				: {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Type": "video/matroska"
				}
			notLoaded ? response.writeHead(416, head) : response.writeHead(206, head);
			const videoStream = fs.createReadStream(moviefile, { start, end })
			if (isMp4) {
				videoStream.pipe(response)
			} else {
				ffmpeg(videoStream)
					.format('matroska')
					.videoBitrate('2048k')
					.on('error', () => { })
					.pipe(response);
			}
		}
	})

	const downloadSubtitle = async (imdb_id, language, download_url) => {
		if (!fs.existsSync(`./subtitles/${imdb_id}`)) {
			fs.mkdirSync(`./subtitles/${imdb_id}`, { recursive: true });
		}

		let downloadSuccess = 1

		await axios.get(download_url)
			.then((response) => {
				fs.writeFile(`./subtitles/${imdb_id}/${imdb_id}-${language}.vtt`, response.data, (err) => {
					if (err)
						console.log(err)
				})

				sql = "INSERT INTO subtitles (imdb_id, language, path) VALUES ($1,$2,$3)"
				pool.query(sql, [imdb_id, language, `/subtitles/${imdb_id}/${imdb_id}-${language}.vtt`])
			}).catch(err => {
				console.log(err)
				downloadSuccess = -1
			})

		return (downloadSuccess)
	}

	const getFilmSubtitles = async (id) => {
		const imdb_full_id = id
		const imdb_id = Number(id.replace(/\D/g, ""));
		const OST_API_KEY = process.env.OST_API_KEY

		let sql = `SELECT * FROM subtitles WHERE imdb_id = $1`
		const oldSubtitles = await pool.query(sql, [imdb_full_id])

		if (oldSubtitles.rows.length === 0) {
			const { data } = await axios.get(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdb_id}`, {
				headers: {
					"Api-Key": OST_API_KEY,
					"Content-Type": 'application/json'
				}
			}).catch(error => {
				console.log(error);
			});

			let finalSubs = []
			const allSubs = data.data.map(sub => sub.attributes)

			subtitleLanguages.forEach(language => {
				const languageSubs = allSubs.filter(sub => sub.language === language && (sub.fps !== 25))
				if (languageSubs.length > 0) {
					const languageSub = languageSubs.reduce((a, b) => (a.download_count > b.download_count ? a : b))
					finalSubs.push(languageSub)
				}
			})

			console.log(finalSubs)

			finalSubs.forEach(async (sub) => {
				await axios.post(`https://api.opensubtitles.com/api/v1/download`, {
					"file_id": sub.files[0].file_id,
					"sub_format": 'webvtt'
				}, {
					headers: {
						"Accept": "application/json",
						"Api-Key": OST_API_KEY,
						"Content-Type": 'application/json'
					}
				}).then(downloadInfo => {
					let download_url = downloadInfo.data.link
					downloadSubtitle(imdb_full_id, sub.language, download_url)
				}).catch(error => {
					console.log(error);
				});
			})

		}
	}

	app.get("/api/streaming/subtext/:id/:language", async (request, response) => {
		const imdb_id = request.params.id
		const language = request.params.language
		if (!subtitleLanguages.includes(language))
			return response.send("Faulty language option")

		const subtitle_file = `./subtitles/${imdb_id}/${imdb_id}-${language}.vtt`

		fs.readFile(subtitle_file, (err, data) => {
			if (err) {
				return response.status(404).send("Subtitle file doesn't exist")
			}
			response.set("Content-Type", "text/plain")
			response.status(200).send(data)
		})
	})

	app.get("/api/streaming/subs/:id", async (request, response) => {
		const imdb_id = request.params.id

		sql = `SELECT * FROM subtitles WHERE imdb_id = $1`
		const { rows } = await pool.query(sql, [imdb_id])

		let subtitleTracks = []
		rows.forEach(sub => {
			subtitleTracks.push({
				kind: "subtitles",
				src: process.env.BACKEND_URL + `/api/streaming/subtext/${imdb_id}/${sub['language']}`,
				srcLang: sub['language'],
				label: sub['language'],
				default: true,
			})
		})

		response.status(200).send(subtitleTracks)
	})

	app.get("/api/streaming/torrent/:id/:quality", async (request, response) => {
		const imdb_id = request.params.id;
		const quality = request.params.quality
		const cookie = request.cookies.refreshToken

		if (!qualityList.includes(quality))
			return response.send("Invalid movie quality")
		const check = `SELECT * FROM users WHERE token = $1`;
		const user = await pool.query(check, [cookie]);
		if (user.rows.length === 0)
			return response.send('User not signed in!')

		let sql = `SELECT * FROM downloads WHERE imdb_id = $1 AND quality = $2`;
		const { rows } = await pool.query(sql, [imdb_id, quality]);

		if (rows.length > 0 && rows[0]["completed"] === "YES")
			response.status(200).send(`Ready to play`);
		else if (rows.length > 0 && fs.existsSync(rows[0]["path"])
			&& fs.statSync(rows[0]["path"]).size > 50000000) {
			console.log(fs.statSync(rows[0]["path"]).size)
			console.log(rows[0]['file_size'])
			console.log(fs.statSync(rows[0]["path"]).size / rows[0]['file_size'])
			let downloadRatio = Math.floor(fs.statSync(rows[0]["path"]).size / rows[0]['file_size'] * 100)
			response.status(200).send(`Ready to play, ${downloadRatio} percent finished`);
		}
		else {
			const movieInfo = await axios.get(`https://yts.mx/api/v2/movie_details.json?imdb_id=${imdb_id}`)
				.then(response => response?.data?.data?.movie);

			if (movieInfo === undefined)
				return response.send("Invalid IMDB_code")

			getFilmSubtitles(imdb_id)

			let responseSent = false;

			console.log(movieInfo)

			let torrentInfo = movieInfo.torrents.filter(torrent => torrent.quality === quality);
			if (torrentInfo.length === 0)
				return response.send("Invalid movie quality")
			let film_title = movieInfo.title_long;

			if (torrentInfo.length > 1)
				torrentInfo.sort((a, b) => (a.seeds > b.seeds ? -1 : 1));
			let magnet_link = getMagnetLink(torrentInfo[0], film_title)

			let torrent_files = await downloadTorrent(magnet_link, imdb_id, quality);
			console.log("Torrent files: ", torrent_files);

			while (fs.existsSync(`movies/${torrent_files[0].path}`) === false)
				await new Promise(r => setTimeout(r, 1000));

			fs.watch(`movies/${torrent_files[0].path}`, (curr, prev) => {
				fs.stat(`movies/${torrent_files[0].path}`, (err, stats) => {
					if (stats?.size > 50000000 && responseSent === false) {
						console.log(stats?.size);
						let downloadRatio = Math.floor(stats?.size / torrent_files[0].size * 100)
						responseSent = true;
						response.status(200).send(`Ready to play, ${downloadRatio} percent finished`);
					}
				});
			});
		}
	});

};

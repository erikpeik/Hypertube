module.exports = (app, fs) => {

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

};

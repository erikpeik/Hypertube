module.exports = (app, path) => {

	app.get('/api/torrent', (request, response) => {
		let torrentStream = require('torrent-stream');
		let pussy_magnet = "magnet:?xt=urn:btih:072DBC2326D0C9ADE755A10B775DFEB3E370C51F&dn=Tom+and+Jerry+Cowboy+Up%21+%282022%29+%5B720p%5D+%5BWEBRip%5D&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2F47.ip-51-68-199.eu%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce"

		let videoPath = path.resolve(__dirname, '../movies')
		console.log("Downloading files to: ", videoPath)

		let options = {
			path: videoPath, // Where to save the files. Overrides `tmp`.
		}
		let engine = torrentStream(pussy_magnet, options);

		engine.on('ready', () => {
			engine.files.forEach(function (file) {
				let fileName = file.name;
				let filePath = file.path;
				console.log(fileName + ' - ' + filePath);
				file.select(file.name)
			})
		})

		engine.on('download', () => {
			console.log("Downloading...")
		})

		engine.on('idle', () => {
			console.log("All files downloaded");
			engine.destroy(() => {
				console.log("Engine connection destroyed");
			})
		})
	})

};

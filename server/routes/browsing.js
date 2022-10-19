module.exports = function (app, pool, bcrypt, cookieParser, bodyParser, jwt) {
	const axios = require("axios")
	const baseUrl = '/api/browsing'
	const TORRENT_API = process.env.TORRENT_API
	app.get(`${baseUrl}/movies`, (req, res) => {
		axios.get(`${TORRENT_API}`)
			.then(response => {
				res.send(response.data)
			})
			.catch(error => {
				console.log(error)
				res.status(500).send({ error: "Something went wrong" })
			})
	})
}

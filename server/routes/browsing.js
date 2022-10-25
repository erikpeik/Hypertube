module.exports = function (app, pool, bcrypt, cookieParser, bodyParser, jwt) {
	const axios = require("axios");
	const baseUrl = "/api/browsing";
	const { TORRENT_API, OMDB_API_KEY } = process.env;

	app.get(`${baseUrl}/movies`, (req, res) => {
		axios
			.get(`${TORRENT_API}`)
			.then((response) => {
				res.send(response.data);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({ error: "Something went wrong" });
			});
	});

	app.post(`${baseUrl}/imdb_data`, async (req, res) => {
		const imdb_id = req.body.imdb_id;

		const { data } = await axios.get(
			`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdb_id}`
		);
		res.status(200).send(data);
	});

	app.post(`${baseUrl}/movie_query`, async (req, res) => {
		const { query, page } = req.body;
		const limit = page === 1 ? 20 : 22;
		axios
			.get(`${TORRENT_API}?query_term=${query}&page=${page}&limit=${limit}`)
			.then((response) => {
				res.send(response.data);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({ error: "Something went wrong" });
			})
	});
};

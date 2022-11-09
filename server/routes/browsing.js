module.exports = function (app, axios) {
	const baseUrl = '/api/browsing';
	const { TORRENT_API, OMDB_API_KEY } = process.env;

	app.get(`${baseUrl}/movies`, (req, res) => {
		axios
			.get(`${TORRENT_API}`)
			.then((response) => {
				res.send(response.data);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({ error: 'Something went wrong' });
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
		let { query, genre, sort_by, order_by, imdb_rating, page } = req.body;
		console.log(req.body);
		const limit = page === 1 ? 20 : 22;
		if (sort_by === undefined) {
			sort_by = 'rating';
		}
		const api_search = `${TORRENT_API}?query_term=${query}&genre=${
			genre || ''
		}&sort_by=${sort_by}&order_by=${order_by || ''}&minimum_rating=${
			imdb_rating || ''
		}&page=${page}&limit=${limit}`;
		console.log(api_search);
		axios
			.get(api_search)
			.then(async (response) => {
				let movies = response.data.data.movies;
				if (movies) {
					await Promise.all(
						movies.map(async (movie) => {
							await axios
								.get(movie.medium_cover_image)
								.catch((error) => {
									movie.medium_cover_image =
										'../images/no_image.png';
								});
						})
					);
				}
				res.send(movies);
			})
			.catch((error) => {
				res.status(406).send({ error: 'Something went wrong' });
			});
	});

	app.get(`${baseUrl}/movie_query/:id`, async (req, res) => {
		const imdb_id = req.params.id;
		const movie_details = await axios.get(
			`https://yts.mx/api/v2/movie_details.json?imdb_id=${imdb_id}`
		);
		res.send(movie_details.data.data);
	});

	app.get(`${baseUrl}/recommended_movies/:id`, async (req, res) => {
		const imdb_id = req.params.id;
		const movie_details = await axios.get(
			`https://yts.mx/api/v2/movie_details.json?imdb_id=${imdb_id}`
		);
		if (movie_details.data.length === 0) {
			res.send({ error: 'Movie not found' });
			return;
		}

		const movie_id = movie_details.data.data.movie.id;
		axios
			.get(
				`https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movie_id}`
			)
			.then((response) => {
				res.send(response.data);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({ error: 'Something went wrong' });
			});
	});

	app.post(`${baseUrl}/check_image`, async (req, res) => {
		const url = req.body.url;
		try {
			await axios.get(url);
			res.status(200).send({ status: 'true' });
		} catch (error) {
			res.status(400).send({ status: 'failed' });
		}
	});
};

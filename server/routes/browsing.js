module.exports = function (app, axios) {
	const baseUrl = '/api/browsing';
	const { TORRENT_API, OMDB_API_KEY } = process.env;

	app.get(`${baseUrl}/movies`, (req, res) => {
		try {
			axios
				.get(`${TORRENT_API}`)
				.then((response) => {
					res.send(response.data);
				})
				.catch((error) => {
					console.log(error);
					res.send({ error: 'Something went wrong' });
				});
		} catch (error) {
			res.send({
				error: 'Something went wrong with torrent API',
			});
		}
	});

	app.post(`${baseUrl}/imdb_data`, async (req, res) => {
		const imdb_id = req.body.imdb_id;
		if (!imdb_id.match(/(?=^.{9,10}$)(^tt[\d]{7,8})$/))
			return res.send('Invalid IMDB_code');
		try {
			const omdb_data = await axios.get(
				`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdb_id}`
			);
			const yts_data = await axios.get(
				`https://yts.mx/api/v2/movie_details.json?imdb_id=${imdb_id}`
			);
			const yts_movie = yts_data.data?.data?.movie;
			if (yts_movie === undefined || yts_movie.title === null) {
				return res.send({ error: 'Movie not found on database' });
			} else if (omdb_data.data.Response === 'False') {
				return res.status(200).send(yts_movie);
			}
			res.status(200).send(omdb_data.data);
		} catch (error) {
			console.log(error);
			return res.send({ error: 'Something went wrong' });
		}
	});

	app.post(`${baseUrl}/movie_query`, async (req, res) => {
		let { query, genre, sort_by, order_by, imdb_rating, page } = req.body;
		if (!page) res.send({ error: 'Page number missing' });
		const limit = page === 1 ? 20 : 22;
		if (sort_by === undefined) {
			sort_by = 'rating';
		}
		try {
			const api_search = `${TORRENT_API}?query_term=${encodeURIComponent(
				query
			)}&genre=${genre || ''}&sort_by=${sort_by}&order_by=${
				order_by || ''
			}&minimum_rating=${imdb_rating || ''}&page=${page}&limit=${limit}`;
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
					res.send({ error: 'Something went wrong' });
				});
		} catch (error) {
			res.send({
				error: 'Something went wrong with movie_query',
			});
		}
	});

	app.get(`${baseUrl}/movie_query/:id`, async (req, res) => {
		try {
			const imdb_id = req.params.id;
			const movie_details = await axios.get(
				`https://yts.mx/api/v2/movie_details.json?imdb_id=${imdb_id}`
			);
			res.send(movie_details.data.data);
		} catch (error) {
			res.send({
				error: 'Something went wrong with faulty movie_query ID',
			});
		}
	});

	app.get(`${baseUrl}/recommended_movies/:id`, async (req, res) => {
		try {
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
					res.send({ error: 'Something went wrong' });
				});
		} catch (error) {
			res.send({
				error: 'Something went wrong with recommended_movies ID',
			});
		}
	});

	app.post(`${baseUrl}/check_image`, async (req, res) => {
		const url = req.body.url;
		try {
			await axios.get(url);
			res.status(200).send({ status: 'true' });
		} catch (error) {
			res.send({ status: 'failed' });
		}
	});
};

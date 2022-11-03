module.exports = function (app, pool) {
	app.post('/api/movies/watch/:id', async (request, response) => {
		const refreshToken = request.cookies.refreshToken;
		if (!refreshToken) return response.send('User not signed in!');

		let sql = `SELECT id FROM users WHERE token = $1`;
		const user = await pool.query(sql, [refreshToken]);
		if (user.rows.length === 0) return response.send('User not signed in!');

		if (request.body.userId !== user.rows[0].id) {
			return response.send('User id and token do not match!');
		}

		sql = `SELECT * FROM movies_watched WHERE imdb_id = $1 AND user_id = $2`;
		const already_watched = await pool.query(sql, [
			request.params.id,
			request.body.userId,
		]);
		if (already_watched.rows.length > 0) {
			return response.send('Movie already watched!');
		}

		sql = 'INSERT INTO movies_watched (imdb_id, user_id) VALUES ($1, $2)';
		await pool.query(sql, [request.params.id, request.body.userId]);
		response.send(true);
	});

	app.post('/api/movies/watch', async (request, response) => {
		console.log('request', request.body.userId);
		const sql = 'SELECT * FROM movies_watched WHERE user_id = $1';
		const watched = await pool.query(sql, [request.body.userId]);
		let finish_array = [];
		for (let i = 0; i < watched.rows.length; i++) {
			finish_array.push(watched.rows[i].imdb_id);
		}
		response.send(finish_array);
	});
};

module.exports = function (app, pool) {
	app.post("/api/newcomment/:id", async (request, response) => {
		const imdb_id = request.params.id;
		const { comment } = request.body;
		if (!comment || comment === '')
			return response.send("Comment missing")
		if (!imdb_id.match(/(?=^.{9,10}$)(^tt[\d]{7,8})$/))
			return response.send("Faulty imdb_id")
		if (comment.length > 500)
			return response.send("Maximum length for comments is 500 characters.")

		const cookie = request.cookies.refreshToken;
		if (cookie) {
			let sql = "SELECT * FROM users WHERE token = $1";
			const { rows } = await pool.query(sql, [cookie]);
			if (rows.length) {
				const user_id = rows[0]["id"];
				const username = rows[0]["username"];
				sql = "SELECT * FROM user_pictures WHERE user_id = $1";
				const picture = await pool.query(sql, [user_id]);
				try {
					sql =
						"INSERT INTO comments (user_id, imdb_id, comment) VALUES ($1, $2, $3) RETURNING *";
					await pool.query(sql, [user_id, imdb_id, comment]);
					response.send(true);
				} catch (error) {
					console.log("ERROR: ", error);
					response.send("")
				}
			} else response.send("");
		} else response.send("");
	});

	app.get("/api/getcomments/:token", async (request, response) => {
		const imdb_id = request.params.token;
		if (!imdb_id.match(/(?=^.{9,10}$)(^tt[\d]{7,8})$/))
			return response.send("Faulty imdb_id")
		try {
			sql = `SELECT comments.id, comments.user_id, username, comment, picture_data, created_at FROM comments
			INNER JOIN users ON comments.user_id = users.id
			LEFT JOIN user_pictures ON users.id = user_pictures.user_id
			WHERE imdb_id = $1`;
			const comments = await pool.query(sql, [imdb_id]);
			response.send(comments.rows);
		} catch (error) {
			console.log("ERROR: ", error);
			response.send("");
		}
	});
};

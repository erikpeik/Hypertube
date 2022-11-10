module.exports = function (app, pool) {
	app.post("/api/newcomment/:id", async (request, response) => {
		const imdb_id = request.params.id;
		const { comment } = request.body;
		if (!comment || comment === '')
			return response.send("Comment missing")
		if (imdb_id.length > 12)
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
				let picture_path;
				if (picture.rows[0] !== undefined)
					picture_path = picture.rows[0]["picture_data"];
				else {
					picture_path =
						"http://localhost:3001/images/file-1666255644329.jpg";
				}
				try {
					sql =
						"INSERT INTO comments (user_id, username, user_pic, imdb_id, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *";
					await pool.query(sql, [user_id, username, picture_path, imdb_id, comment]);
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
		if (imdb_id.length > 12)
			return response.send("Faulty imdb_id")
		try {
			sql = "SELECT * FROM comments WHERE imdb_id = $1";
			const comments = await pool.query(sql, [imdb_id]);
			response.send(comments.rows);
		} catch (error) {
			console.log("ERROR: ", error);
			response.send("");
		}
	});
};

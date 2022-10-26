module.exports = function (app, pool) {
	app.post("/api/newcomment/:id", async (request, response) => {
		const imdb_id = request.params.id;
		const comment = request.body;
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			let sql = "SELECT * FROM users WHERE token = $1";
			const { rows } = await pool.query(sql, [cookie]);
			if (rows.length) {
				const user_id = rows[0]["id"];
				try {
					sql =
						"INSERT INTO comments (user_id, imdb_id, comment) VALUES ($1, $2, $3) RETURNING *";
					await pool.query(sql, [user_id, imdb_id, comment.comment]);
					response.send(true);
					return;
				} catch (error) {
					console.log("ERROR: ", error);
				}
			} else response.send("");
		} else response.send("");
	});
};

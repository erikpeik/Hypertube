module.exports = function (app, pool) {
	app.post("/api/movies/:id", async (request, response) => {
		const cookie = request.cookies.refreshToken;

		if (!cookie) return response.send('User not signed in!');
		const check = `SELECT * FROM users WHERE token = $1`;
		const user = await pool.query(check, [cookie]);
		if (user.rows.length === 0) return response.send("User not signed in!");
			response.send("Success!");
		// const sql = "INSERT INTO movies (imdb_id) VALUES ($1) RETURNING *";
		// const { rows } = await pool.query(sql, [request.params.id]);
		// response.send(rows[0]);
	})
}
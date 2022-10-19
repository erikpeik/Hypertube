module.exports = function (app, pool, bcrypt, cookieParser, bodyParser, jwt) {
	app.post("/api/login", async (request, response) => {
		const { username, password } = request.body;

		var sql = `SELECT * FROM users
					WHERE username = $1 OR email = $1`;
		const { rows } = await pool.query(sql, [username]);
		if (rows.length === 0) {
			throw "User not found!";
		} else if (rows[0]["verified"] === "NO") {
			throw "User account not yeat activated! Please check your inbox for confirmation email.";
		} else {
			const compareResult = await bcrypt.compare(
				password,
				rows[0]["password"]
			);
			if (compareResult) {
				const userId = rows[0]["id"];
				const name = rows[0]["username"];
				const email = rows[0]["email"];

				const accessToken = jwt.sign(
					{ userId, name, email },
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: "20s",
					}
				);
				const refreshToken = jwt.sign(
					{ userId, name, email },
					process.env.REFRESH_TOKEN_SECRET,
					{
						expiresIn: "1d",
					}
				);
				response.cookie("refreshToken", refreshToken, {
					httpOnly: false,
					maxAge: 60 * 1000,
				});
				const sql1 = `UPDATE users SET token = $1 WHERE id = $2`;
				const { rows1 } = await pool.query(sql1, [
					refreshToken,
					userId,
				]);

				response.json({ accessToken, username: name, userid: userId });
			} else throw "Wrong password!";
		}
	});

	app.get("/api/login", async (request, response) => {
		var cookie = request.cookies.refreshToken;

		if (cookie) {
			const sql = "SELECT * FROM users WHERE token = $1";
			const { rows } = await pool.query(sql, [cookie]);
			response.send({ name: rows[0]["username"], id: rows[0]["id"] });
		} else response.send("");
	});

	app.post("/api/logout", async (request, response) => {
		const refreshToken = request.cookies.refreshToken;
		if (!refreshToken) return response.sendStatus(204);
		var sql = `SELECT * FROM users WHERE token = $1`;
		const { rows } = await pool.query(sql, [refreshToken]);
		if (rows.length !== 0) {
			const userId = rows[0]["id"];
			const sql1 = `UPDATE users SET token = $1 WHERE id = $2`;
			await pool.query(sql1, [0, userId]);
		}
		const cookie = response.clearCookie("refreshToken");
		response.status(200).json({ msg: "Logged out" });
	});
};

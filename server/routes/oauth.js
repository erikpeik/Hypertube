module.exports = function (app, pool, axios, helperFunctions, jwt) {
	const GITHUB_URL = "https://github.com/login/oauth/access_token";
	const { Octokit } = require("octokit");

	app.post("/api/oauth/githubconnect", (request, response) => {
		const { token } = request.body;

		axios
			.get("https://api.github.com", {
				headers: {
					Authorization: "token " + token,
				},
			})
			.then((res) => {
				response.send(res.data);
			})
			.catch((error) => {
				response.send(false);
			});
	});

	app.get("/api/oauth/githubdirect", async (request, response) => {
		axios({
			method: "POST",
			url: `${GITHUB_URL}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${request.query.code}`,
			headers: {
				Accept: "application/json",
			},
		}).then(async (github_response) => {
			const octokit = new Octokit({
				auth: github_response.data.access_token,
			});
			const email = await octokit.request("GET /user/emails", {});
			const user = await octokit.request("GET /user", {});

			const userData = {
				login: user.data.login,
				firstname: user.data.name.split(" ")[0],
				lastname: user.data.name.split(" ")[1],
				email: email.data[0].email,
			};

			let sql = `SELECT * FROM users WHERE email = $1 OR username = $2`;
			let { rows } = await pool.query(sql, [
				email.data[0].email,
				user.data.login,
			]);

			if (rows.length) {
				let id = rows[0]["id"];
				let mail = userData.email;
				let name = userData.login;
				const refreshToken = jwt.sign(
					{ id, name, mail },
					process.env.REFRESH_TOKEN_SECRET,
					{
						expiresIn: "1d",
					}
				);
				response.cookie("refreshToken", refreshToken, {
					httpOnly: false,
					maxAge: 24 * 60 * 60 * 1000,
				});
				const sql1 = `UPDATE users SET token = $1 WHERE id = $2`;
				await pool.query(sql1, [refreshToken, id]);
			} else {
				let password = helperFunctions.makeToken(10);
				sql =
					"INSERT INTO users (username, firstname, lastname, email, password, verified) VALUES ($1,$2,$3,$4,$5,'YES') RETURNING *";
				var rows1 = await pool.query(sql, [
					userData.login,
					userData.firstname,
					userData.lastname,
					userData.email,
					password,
				]);
				let id = rows1.rows[0]["id"];
				let mail = userData.email;
				let name = userData.login;
				const refreshToken = jwt.sign(
					{ id, name, mail },
					process.env.REFRESH_TOKEN_SECRET,
					{
						expiresIn: "1d",
					}
				);
				response.cookie("refreshToken", refreshToken, {
					httpOnly: false,
					maxAge: 24 * 60 * 60 * 1000,
				});
				const sql1 = `UPDATE users SET token = $1 WHERE id = $2`;
				await pool.query(sql1, [refreshToken, id]);
			}

			console.log(userData);

			response.redirect(`http://localhost:3000/profile`);
		});
	});
};

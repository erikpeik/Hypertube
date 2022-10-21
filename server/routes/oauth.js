module.exports = function (app, pool, axios, helperFunctions, jwt) {
	const GITHUB_URL = "https://github.com/login/oauth/access_token";
	const FORTYTWO_URL = 'https://api.intra.42.fr/oauth/token'
	const { Octokit } = require("octokit");

	const logInUser = async (userData, id, response) => {
		let mail = userData.email;
		let name = userData.username;
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
		return;
	}

	const signUpUser = async (userData, response) => {
		let password = helperFunctions.makeToken(10);
		sql = `INSERT INTO users (username, firstname, lastname, email, password, verified) VALUES ($1,$2,$3,$4,$5,'YES') RETURNING *`;
		var rows1 = await pool.query(sql, [
			userData.username,
			userData.firstname,
			userData.lastname,
			userData.email,
			password,
		]);
		let id = rows1.rows[0]["id"];
		let mail = userData.email;
		let name = userData.username;
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
		return;
	}

	app.get("/api/oauth/githubdirect", async (request, response) => {
		const github_response = await axios({
			method: "POST",
			url: `${GITHUB_URL}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${request.query.code}`,
			headers: { Accept: "application/json" }
		})

		const octokit = new Octokit({ auth: github_response.data.access_token });
		const email = await octokit.request("GET /user/emails", {});
		const user = await octokit.request("GET /user", {});

		const userData = {
			username: user.data.login,
			firstname: user.data.name.split(" ")[0],
			lastname: user.data.name.split(" ")[1],
			email: email.data[0].email,
		};

		let sql = `SELECT * FROM users WHERE email = $1 OR username = $2`;
		let { rows } = await pool.query(sql, [email.data[0].email, user.data.login]);

		if (rows.length) {
			await logInUser(userData, rows[0]["id"], response)
		} else {
			await signUpUser(userData, response)
		}

		response.redirect(`http://localhost:3000/profile`);

	});

	app.get("/api/oauth/42direct", async (request, response) => {
		let code = request.query.code

		const fortytwo_response = await axios.post(`${FORTYTWO_URL}`, {
			grant_type: 'authorization_code',
			client_id: process.env.FORTYTWO_CLIENT_ID,
			client_secret: process.env.FORTYTWO_CLIENT_SECRET,
			code: code,
			redirect_uri: 'http://localhost:3001/api/oauth/42direct'
		})

		const { data } = await axios.get("https://api.intra.42.fr/v2/me", {
			headers: { Authorization: 'Bearer ' + fortytwo_response.data.access_token }
		})

		const userData = {
			username: data.login,
			firstname: data.first_name,
			lastname: data.last_name,
			email: data.email,
		};

		let sql = `SELECT * FROM users WHERE email = $1 OR username = $2`;
		let { rows } = await pool.query(sql, [
			data.email,
			data.login,
		]);

		if (rows.length) {
			await logInUser(userData, rows[0]["id"], response)
		} else {
			await signUpUser(userData, response)
		}

		response.redirect(`http://localhost:3000/profile`);

	})

};

module.exports = function (app, pool, axios) {
	const GITHUB_URL = "https://github.com/login/oauth/access_token";
	const { Octokit } = require("octokit");

	app.post("/api/oauth/githubconnect", (request, response) => {
		const { token } = request.body

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
				response.send(false)
				// console.log("error " + error);
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
				auth: github_response.data.access_token
			})

			const email = await octokit.request('GET /user/emails', {})
			const user = await octokit.request('GET /user', {})
			// console.log(email)
			// console.log(user)

			const userData = {
				login: user.data.login,
				firstname: user.data.name.split(' ')[0],
				lastname: user.data.name.split(' ')[1],
				email: email.data[0].email
			}

			// let sql = "INSERT INTO users (username, firstname, lastname, email, github_token) VALUES ($1,$2,$3,$4,$5) RETURNING *";
			// var { rows } = await pool.query(sql, [
			// 	userData.login,
			// 	userData.firstname,
			// 	userData.lastname,
			// 	userData.email,
			// 	github_response.data.access_token
			// ]);

			console.log(userData)

			response.redirect(
				`http://localhost:3000/oauth?access_token=${github_response.data.access_token}`
			);
		});
	});
};

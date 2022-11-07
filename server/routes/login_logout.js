module.exports = function (app, pool, bcrypt, jwt, helperFunctions) {
	app.post('/api/login', async (request, response) => {
		const { username, password, language } = request.body;
		if (!username || !password || !language)
			return response.send('Required login data missing');
		if (helperFunctions.checkValidLanguage(language) !== true) {
			return 'Faulty language information';
		}

		var sql = `SELECT * FROM users
					WHERE username = $1 OR email = $1`;
		const { rows } = await pool.query(sql, [username]);
		if (rows.length === 0) {
			res = await helperFunctions.translate(
				'User not found!',
				pool,
				language
			);
			return response.send(res);
		} else if (rows[0]['verified'] === 'NO') {
			res = await helperFunctions.translate(
				'User account not yeat activated! Please check your inbox for confirmation email.',
				pool,
				language
			);
			return response.send(res);
		} else {
			const compareResult = await bcrypt.compare(
				password,
				rows[0]['password']
			);
			if (compareResult) {
				const userId = rows[0]['id'];
				const name = rows[0]['username'];
				const email = rows[0]['email'];

				const accessToken = jwt.sign(
					{ userId, name, email },
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: '20s',
					}
				);
				const refreshToken = jwt.sign(
					{ userId, name, email },
					process.env.REFRESH_TOKEN_SECRET,
					{
						expiresIn: '1d',
					}
				);
				response.cookie('refreshToken', refreshToken, {
					httpOnly: false,
					maxAge: 24 * 60 * 60 * 1000,
				});
				const sql1 = `UPDATE users SET token = $1 WHERE id = $2`;
				await pool.query(sql1, [refreshToken, userId]);

				response.json({ accessToken, username: name, userid: userId });
			} else {
				res = await helperFunctions.translate(
					'Wrong password!',
					pool,
					language
				);
				return response.send(res);
			}
		}
	});

	app.get('/api/login', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (!cookie) return response.send('');

		const sql = 'SELECT * FROM users WHERE token = $1';
		const { rows } = await pool.query(sql, [cookie]);
		if (rows.length) {
			response.send({ name: rows[0]['username'], id: rows[0]['id'] });
		} else response.send('');
	});

	app.post('/api/logout', async (request, response) => {
		const refreshToken = request.cookies.refreshToken;
		if (!refreshToken) return response.send('');

		var sql = `SELECT * FROM users WHERE token = $1`;
		const { rows } = await pool.query(sql, [refreshToken]);
		if (rows.length !== 0) {
			const userId = rows[0]['id'];
			const sql1 = `UPDATE users SET token = $1 WHERE id = $2`;
			await pool.query(sql1, [0, userId]);
		}
		response.clearCookie('refreshToken');
		response.status(200).json({ msg: 'Logged out' });
	});
};

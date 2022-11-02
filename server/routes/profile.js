module.exports = (app, pool, bcrypt, upload, fs, path, helperFunctions) => {
	app.post('/api/profile/editsettings', async (request, response) => {
		const cookie = request.cookies.refreshToken;

		if (!cookie) return response.send('User not signed in!');
		const check = `SELECT * FROM users WHERE token = $1`;
		const user = await pool.query(check, [cookie]);
		if (user.rows.length === 0) return response.send("User not signed in!");

		const { username, firstname, lastname, email, language } = request.body;
		var sql =
			'SELECT * FROM users WHERE (username = $1 OR email = $2) AND id != $3';
		const { rows } = await pool.query(sql, [
			username,
			email,
			user.rows[0]['id'],
		]);
		if (rows.length !== 0) {
			res = await helperFunctions.translate(
				'Username or email is already in use!',
				pool,
				language
			);
			return response.send(res);
		}
		if (username.length < 4 || username.length > 25) {
			res = await helperFunctions.translate(
				'Username has to be between 4 and 25 characters.',
				pool,
				language
			);
			return response.send(res);
		}
		if (!username.match(/^[a-z0-9]+$/i)) {
			res = await helperFunctions.translate(
				'Username should only include characters (a-z or A-Z) and numbers (0-9).',
				pool,
				language
			);
			return response.send(res);
		}
		if (firstname.length > 50 || lastname.length > 50) {
			res = await helperFunctions.translate(
				'Maximum length for firstname and lastname is 50 characters.',
				pool,
				language
			);
			return response.send(res);
		}
		if (
			!firstname.match(/^[a-zåäö-]+$/i) ||
			!lastname.match(/^[a-zåäö-]+$/i)
		) {
			res = await helperFunctions.translate(
				'First name and last name can only include characters a-z, å, ä, ö and dash (-).',
				pool,
				language
			);
			return response.send(res);
		}
		if (
			email.length > 254 ||
			!email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		) {
			res = await helperFunctions.translate(
				'Please enter a valid e-mail address.',
				pool,
				language
			);
			return response.send(res);
		}
		try {
			let sql = `UPDATE users SET username = $1, firstname = $2, lastname = $3, email = $4, language = $5
						WHERE id = $6`;
			await pool.query(sql, [
				username,
				firstname,
				lastname,
				email,
				language,
				user.rows[0]['id'],
			]);
			response.send(true);
		} catch (error) {
			console.log(error);
			res = await helperFunctions.translate(
				'User settings update failed for some reason ¯\\_(ツ)_/¯',
				pool,
				language
			);
			return response.send(res);
		}
	});

	app.post('/api/profile/changepassword', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		const { oldPassword, newPassword, confirmPassword, language } =
			request.body;

		if (newPassword !== confirmPassword) {
			res = await helperFunctions.translate(
				'The entered new passwords are not the same!',
				pool,
				language
			);
			return response.send(res);
		} else if (
			!newPassword.match(
				/(?=^.{8,30}$)(?=.*\d)(?=.*[!.@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$/
			)
		) {
			res = await helperFunctions.translate(
				'PLEASE ENTER A NEW PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character (a-z), at least one uppercase character (A-Z), at least one numeric character (0-9) and at least one special character',
				pool,
				language
			);
			return response.send(res);
		}

		if (cookie) {
			const sql = 'SELECT * FROM users WHERE token = $1';
			const { rows } = await pool.query(sql, [cookie]);

			if (!(await bcrypt.compare(oldPassword, rows[0]['password']))) {
				res = await helperFunctions.translate(
					'The old password is not correct!',
					pool,
					language
				);
				return response.send(res);
			} else {
				const hash = await bcrypt.hash(newPassword, 10);
				try {
					var sql1 = 'UPDATE users SET password = $1 WHERE id = $2';
					await pool.query(sql1, [hash, rows[0]['id']]);
					return response.send(true);
				} catch (error) {
					console.log('ERROR :', error);
					res = await helperFunctions.translate(
						'Password creation failed',
						pool,
						language
					);
					return response.send(res);
				}
			}
		}
	});

	app.get('/api/profile/:id', async (request, response) => {
		let = sql =
			'SELECT * FROM users \
						JOIN user_pictures up on users.id = up.user_id \
						where user_id = $1';
		const { rows } = await pool.query(sql, [request.params.id]);
		response.send(rows[0]);
	});

	app.get('/api/profile', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			try {
				let sql = 'SELECT * FROM users WHERE token = $1';
				const { rows } = await pool.query(sql, [cookie]);
				const { password: removed_password, ...profileData } = rows[0];

				sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
				var profile_pic = await pool.query(sql, [rows[0]['id']]);

				if (profile_pic.rows[0]) {
					profileData.profile_pic = profile_pic.rows[0];
				} else {
					profileData.profile_pic = {
						user_id: rows[0]['id'],
						picture_data: null,
					};
				}
				response.send(profileData);
			} catch (error) {
				response.send(false);
			}
		} else {
			response.send(false);
		}
	});

	app.post(
		'/api/profile/setprofilepic',
		upload.single('file'),
		async (request, response) => {
			const cookie = request.cookies.refreshToken;
			const image =
				'http://localhost:3001/images/' + request.file.filename;
			const language = request.body
			console.log(language)

			if (cookie) {
				if (request.file.size > 5242880)
					return response.send(
						'The maximum size for uploaded images is 5 megabytes.'
					);
				if (
					request.file.mimetype !== 'image/png' &&
					request.file.mimetype !== 'image/jpg' &&
					request.file.mimetype !== 'image/jpeg'
				)
					return response.send('Not right file type!');
				try {
					let sql = `SELECT * FROM users WHERE token = $1`;
					let user = await pool.query(sql, [cookie]);
					sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
					let { rows } = await pool.query(sql, [user.rows[0]['id']]);

					if (rows.length === 0) {
						sql = `INSERT INTO user_pictures (user_id, picture_data, profile_pic) VALUES ($1, $2, 'YES')`;
						await pool.query(sql, [user.rows[0]['id'], image]);
					} else {
						let oldImageData = rows[0]['picture_data'];
						const oldImage =
							path.resolve(__dirname, '../images') +
							oldImageData.replace(
								'http://localhost:3001/images',
								''
							);
						if (fs.existsSync(oldImage)) {
							fs.unlink(oldImage, (err) => {
								if (err) {
									console.error(err);
									return;
								}
							});
						}

						sql = `UPDATE user_pictures SET picture_data = $1 WHERE user_id = $2 AND profile_pic = 'YES'`;
						await pool.query(sql, [image, user.rows[0]['id']]);
						sql = `UPDATE comments SET user_pic = $1 WHERE user_id = $2`;
						await pool.query(sql, [image, user.rows[0]['id']]);
					}
					response.send(true);
				} catch (error) {
					console.log(error);
					response.send('Image uploading failed for some reason.');
				}
			}
		}
	);

	app.delete('/api/profile/deleteuser', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			const getId = 'SELECT * FROM users WHERE token = $1';
			const { rows } = await pool.query(getId, [cookie]);
			const id = rows[0]['id'];
			try {
				var sql = `DELETE FROM users WHERE id = $1`;
				pool.query(sql, [id]);
				response.send(true);
			} catch (error) {
				console.log(error);
				response.send('Failed to delete user!');
			}
		}
	});
};

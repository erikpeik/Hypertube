module.exports = function (app, pool, bcrypt, transporter, upload, helperFunctions) {
	checkSignUpData = (body) => {
		let res;
		if (
			!body.username ||
			!body.firstname ||
			!body.lastname ||
			!body.email ||
			!body.password ||
			!body.confirmPassword ||
			!body.language
		)
			return 'Required profile data missing';
		if (helperFunctions.checkValidLanguage(body.language) !== true) {
			return 'Faulty language information';
		}
		if (body.username.length < 4 || body.username.length > 25) {
			res = helperFunctions.translate(
				'Username has to be between 4 and 25 characters.',
				pool,
				body.language
			);
			return res;
		}
		if (!body.username.match(/^[a-z0-9]+$/i)) {
			res = helperFunctions.translate(
				'Username should only include characters (a-z or A-Z) and numbers (0-9).',
				pool,
				body.language
			);
			return res;
		}
		if (body.firstname.length > 50 || body.lastname.length > 50) {
			res = helperFunctions.translate(
				"Come on, your name can't seriously be that long. Maximum for first name and last name is 50 characters.",
				pool,
				body.language
			);
			return res;
		}
		if (
			!body.firstname.match(/^[a-zåäö-]+$/i) ||
			!body.lastname.match(/^[a-zåäö-]+$/i)
		) {
			res = helperFunctions.translate(
				'First name and last name can only include characters a-z, å, ä, ö and dash (-).',
				pool,
				body.language
			);
			return res;
		}
		if (
			body.email.length > 254 ||
			!body.email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		) {
			res = helperFunctions.translate(
				'Please enter a valid e-mail address.',
				pool,
				body.language
			);
			return res;
		}
		if (
			!body.password.match(
				/(?=^.{8,30}$)(?=.*\d)(?=.*[!.@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$/
			)
		) {
			res = helperFunctions.translate(
				'PLEASE ENTER A PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character, at least one uppercase character, at least one numeric character and at least one special character',
				pool,
				body.language
			);
			return res;
		}
		if (body.password !== body.confirmPassword) {
			res = helperFunctions.translate(
				'The entered passwords are not the same!',
				pool,
				body.language
			);
			return res;
		}

		const checkUsername = async () => {
			var sql = 'SELECT * FROM users WHERE username = $1';
			const { rows } = await pool.query(sql, [body.username]);
			if (rows.length) {
				res = helperFunctions.translate(
					'Username already exists!',
					pool,
					body.language
				);
				throw res;
			} else return;
		};

		const checkEmail = async () => {
			var sql = 'SELECT * FROM users WHERE email = $1';
			const { rows } = await pool.query(sql, [body.email]);
			if (rows.length) {
				res = helperFunctions.translate(
					'User with this e-mail already exists!',
					pool,
					body.language
				);
				throw res;
			} else return;
		};

		return checkUsername()
			.then(() => checkEmail())
			.then(() => {
				return true;
			})
			.catch((error) => {
				return error;
			});
	};

	app.post('/api/signup', async (request, response) => {
		const checkResult = await checkSignUpData(request.body);
		if (checkResult === true) {
			const { username, firstname, lastname, email, password, language } =
				request.body;

			const saveHashedUser = async () => {
				const hash = await bcrypt.hash(password, 10);
				try {
					var sql =
						'INSERT INTO users (username, firstname, lastname, email, password) VALUES ($1,$2,$3,$4,$5)';
					await pool.query(sql, [
						username,
						firstname,
						lastname,
						email,
						hash,
					]);
					return;
				} catch (error) {
					console.log('ERROR :', error);
					res = await helperFunctions.translate(
						'User creation failed!',
						pool,
						language
					);
					throw res;
				}
			};

			const createVerifyCode = async () => {
				const getUserId = async () => {
					var sql = 'SELECT id FROM users WHERE username = $1';
					const { rows } = await pool.query(sql, [username]);
					return rows[0]['id'];
				};

				var code = helperFunctions.makeToken(30);

				getUserId()
					.then((user_id) => {
						var sql =
							'INSERT INTO email_verify (user_id, email, verify_code) VALUES ($1,$2,$3)';
						pool.query(sql, [user_id, email, code]);
					})
					.catch((error) => {
						console.log(error);
					});
				return code;
			};

			let subject = await helperFunctions.translate(
				'Hypertube account confirmation',
				pool,
				language
			);
			let html = await helperFunctions.translate(
				`<h1>Welcome</h1><p>You have just signed up for Hypertube, well done!</p>
				<p>To fully access the world of Hypertube and find the movie that was meant for you,
				you just need to confirm your account with a single click. Yes, it's that easy!</p>
				<p>Kisses and hugs, Hypertube Mail xoxoxoxo</p>`,
				pool,
				language
			);
			let click = await helperFunctions.translate(
				'Click here to start finding the perfect movies!',
				pool,
				language
			);

			const sendConfirmationMail = (useremail, code) => {
				var mailOptions = {
					from: process.env.EMAIL_ADDRESS,
					to: useremail,
					subject: subject,
					html: `${html} <a href="http://localhost:3000/confirm/${username}/${code}">${click}</a>`,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});
			};

			saveHashedUser()
				.then(() => createVerifyCode())
				.then((code) => sendConfirmationMail(email, code))
				.then(() => {
					response.send(true);
				})
				.catch((error) => {
					response.send(error);
				});
		} else {
			response.send(checkResult);
		}
	});

	app.post('/api/signup/setprofilepic/:user/:language', upload.single('file'), async (request, response) => {
		const username = request.params.user;
		const language = request.params.language;
		if (helperFunctions.checkValidLanguage(language) !== true) {
			return response.send('Faulty language information');
		}
		if (!request.file)
			return response.send('Required profile pic data missing');
		const image =
			'http://localhost:3001/images/' + request.file?.filename;

		if (request.file?.size > 5242880) {
			res = await helperFunctions.translate(
				'The maximum size for uploaded images is 5 megabytes.',
				pool,
				language
			);
			return response.send(res);
		}
		if (
			request.file?.mimetype !== 'image/png' &&
			request.file?.mimetype !== 'image/jpg' &&
			request.file?.mimetype !== 'image/jpeg'
		) {
			res = await helperFunctions.translate(
				'Not right file type!',
				pool,
				language
			);
			return response.send(res);
		}
		try {
			let sql = `SELECT * FROM users WHERE username = $1`;
			let user = await pool.query(sql, [username]);
			sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
			let { rows } = await pool.query(sql, [user.rows[0]['id']]);

			if (rows.length === 0) {
				sql = `INSERT INTO user_pictures (user_id, picture_data, profile_pic) VALUES ($1, $2, 'YES')`;
				await pool.query(sql, [user.rows[0]['id'], image]);
			} else {
				return response.send("Failure, a new user shouldn't have a profile picture")
			}
			response.send(true);
		} catch (error) {
			console.log(error);
			res = await helperFunctions.translate(
				'Image uploading failed for some reason.',
				pool,
				language
			);
			return response.send(res);
		}
	});

	app.post('/api/signup/verifyuser', (request, response) => {
		const { username, code } = request.body;

		if (!username || !code)
			return response.send('Required verify data missing');

		const checkCode = async () => {
			var sql = `SELECT * FROM email_verify
						INNER JOIN users ON email_verify.user_id = users.id
						WHERE email_verify.verify_code = $1`;
			const { rows } = await pool.query(sql, [code]);
			if (rows.length === 0) {
				throw 'No code found!';
			} else {
				return 'Code matches!';
			}
		};

		const setAccountVerified = () => {
			var sql = `UPDATE users SET verified = 'YES' WHERE username = $1`;
			pool.query(sql, [username]);

			var sql = `DELETE FROM email_verify WHERE verify_code = $1`;
			pool.query(sql, [code]);
		};

		checkCode()
			.then(() => {
				setAccountVerified();
				response.send(true);
			})
			.catch((error) => {
				response.send(error);
			});
	});
};

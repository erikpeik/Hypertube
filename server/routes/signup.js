module.exports = function (app, pool, bcrypt, transporter, helperFunctions) {
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
			const { username, firstname, lastname, email, password } =
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
					throw 'User creation failed!';
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

			const sendConfirmationMail = (useremail, code) => {
				var mailOptions = {
					from: process.env.EMAIL_ADDRESS,
					to: useremail,
					subject: 'Hypertube account confirmation',
					html: `<h1>Welcome</h1><p>You have just signed up for Hypertube, well done!</p>
						<p>To fully access the world of Hypertube and find the movie that was meant for you,
						you just need to confirm your account with a single click. Yes, it's that easy!</p>
						<a href="http://localhost:3000/confirm/${username}/${code}">Click here to start finding perfect movies!</a>
						<p>Kisses and hugs, Hypertube Mail xoxoxoxo</p>`,
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

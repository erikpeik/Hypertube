module.exports = (
	app,
	pool,
	bcrypt,
	cookieParser,
	bodyParser,
	upload,
	fs,
	path
) => {
	app.post("/api/profile/editsettings", async (request, response) => {
		const cookie = request.cookies.refreshToken;
		const { username, firstname, lastname, email } = request.body;

		if (!cookie) return response.send("User not signed in!");
		const check = `SELECT * FROM users WHERE token = $1`;
		const user = await pool.query(check, [cookie]);
		var sql =
			"SELECT * FROM users WHERE (username = $1 OR email = $2) AND id != $3";
		const { rows } = await pool.query(sql, [
			username,
			email,
			user.rows[0]["id"],
		]);
		if (rows.length !== 0)
			return response.send("Username or email is already in use!");
		if (username.length < 4 || username.length > 25)
			return response.send(
				"Username has to be between 4 and 25 characters."
			);
		if (!username.match(/^[a-z0-9]+$/i))
			return response.send(
				"Username should only include characters (a-z or A-Z) and numbers (0-9)."
			);
		if (firstname.length > 50 || lastname.length > 50)
			return response.send(
				"Maximum length for firstname and lastname is 50 characters."
			);
		if (
			!firstname.match(/^[a-zåäö-]+$/i) ||
			!lastname.match(/^[a-zåäö-]+$/i)
		)
			return response.send(
				"First name and last name can only include characters a-z, å, ä, ö and dash (-)."
			);
		if (
			email.length > 254 ||
			!email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		)
			return response.send("Please enter a valid e-mail address.");
		try {
			let sql = `UPDATE users SET username = $1, firstname = $2, lastname = $3, email = $4
						WHERE id = $5`;
			await pool.query(sql, [
				username,
				firstname,
				lastname,
				email,
				user.rows[0]["id"],
			]);
			response.send(true);
		} catch (error) {
			console.log(error);
			response.send("User settings update failed for some reason");
		}
	});

	app.post("/api/profile/changepassword", async (request, response) => {
		const cookie = request.cookies.refreshToken;
		const { oldPassword, newPassword, confirmPassword } = request.body;

		if (newPassword !== confirmPassword) {
			return response.send("The entered new passwords are not the same!");
		} else if (
			!newPassword.match(
				/(?=^.{8,30}$)(?=.*\d)(?=.*[!.@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$/
			)
		) {
			return response.send(
				"PLEASE ENTER A NEW PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character (a-z), at least one uppercase character (A-Z), at least one numeric character (0-9) and at least one special character (!.@#$%^&*)"
			);
		}

		if (cookie) {
			const sql = "SELECT * FROM users WHERE token = $1";
			const { rows } = await pool.query(sql, [cookie]);

			if (!(await bcrypt.compare(oldPassword, rows[0]["password"]))) {
				return response.send("The old password is not correct!");
			} else {
				const hash = await bcrypt.hash(newPassword, 10);
				try {
					var sql1 = "UPDATE users SET password = $1 WHERE id = $2";
					await pool.query(sql1, [hash, rows[0]["id"]]);
					return response.send(true);
				} catch (error) {
					console.log("ERROR :", error);
					return response.send("Password creation failed");
				}
			}
		}
	});

	app.get("/api/profile", async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			try {
				let sql = "SELECT * FROM users WHERE token = $1";
				const { rows } = await pool.query(sql, [cookie]);
				const { password: removed_password, ...profileData } = rows[0];

				sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
				var profile_pic = await pool.query(sql, [rows[0]["id"]]);

				if (profile_pic.rows[0]) {
					profileData.profile_pic = profile_pic.rows[0];
				} else {
					profileData.profile_pic = {
						user_id: rows[0]["id"],
						picture_data: null,
					};
				}

				// var sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'NO' ORDER BY picture_id`
				// var other_pictures = await pool.query(sql, [sess.userid])
				// if (other_pictures.rows) {
				// 	profileData.other_pictures = other_pictures.rows
				// }
				// console.log(profileData)

				response.send(profileData);
			} catch (error) {
				response.send(false);
			}
		} else {
			response.send(false);
		}
	});

	app.post(
		"/api/profile/setprofilepic",
		upload.single("file"),
		async (request, response) => {
			const cookie = request.cookies.refreshToken;
			const image =
				"http://localhost:3001/images/" + request.file.filename;

			if (cookie) {
				console.log(request.file);
				if (request.file.size > 5242880)
					return response.send(
						"The maximum size for uploaded images is 5 megabytes."
					);
				if (
					request.file.mimetype !== "image/png" &&
					request.file.mimetype !== "image/jpg" &&
					request.file.mimetype !== "image/jpeg"
				)
					return response.send("Not right file type!");
				try {
					let sql = `SELECT * FROM users WHERE token = $1`;
					let user = await pool.query(sql, [cookie]);
					sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
					let { rows } = await pool.query(sql, [user.rows[0]["id"]]);

					if (rows.length === 0) {
						sql = `INSERT INTO user_pictures (user_id, picture_data, profile_pic) VALUES ($1, $2, 'YES')`;
						await pool.query(sql, [user.rows[0]["id"], image]);
					} else {
						let oldImageData = rows[0]["picture_data"];
						const oldImage =
							path.resolve(__dirname, "../images") +
							oldImageData.replace(
								"http://localhost:3001/images",
								""
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
						await pool.query(sql, [image, user.rows[0]["id"]]);
					}
					response.send(true);
				} catch (error) {
					console.log(error);
					response.send("Image uploading failed for some reason.");
				}
			}
		}
	);

	// app.post('/api/profile/imageupload', upload.single('file'), async (request, response) => {
	// 	const sess = request.session
	// 	const image = 'http://localhost:3000/images/' + request.file.filename

	// 	if (sess.userid) {
	// 		if (request.file.size > 5242880)
	// 			return response.send("The maximum size for uploaded images is 5 megabytes.")
	// 		try {
	// 			var sql = `SELECT * FROM user_pictures WHERE user_id = $1`
	// 			var { rows } = await pool.query(sql, [sess.userid])

	// 			if (rows.length < 5) {
	// 				var sql = `INSERT INTO user_pictures (user_id, picture_data, profile_pic) VALUES ($1, $2, 'NO')`
	// 				await pool.query(sql, [sess.userid, image])
	// 				var sql = `UPDATE fame_rates SET picture_pts = picture_pts + 2, total_pts = total_pts + 2
	// 							WHERE user_id = $1 AND picture_pts < 10 AND total_pts <= 98`
	// 				await pool.query(sql, [sess.userid])
	// 				response.send(true)
	// 			} else {
	// 				response.send("You have uploaded too many pictures. Delete some to make room for new ones!")
	// 			}
	// 		} catch (error) {
	// 			console.log(error)
	// 			response.send("Image uploading failed for some reason.")
	// 		}
	// 	}
	// })

	// app.delete("/api/profile/deletepicture/:id", async (request, response) => {
	// 	const sess = request.session;

	// 	if (sess.userid) {
	// 		const picture_id = request.params.id;

	// 		var sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND picture_id = $2`;
	// 		var { rows } = await pool.query(sql, [sess.userid, picture_id]);

	// 		var oldImageData = rows[0]["picture_data"];
	// 		if (
	// 			oldImageData !==
	// 			"http://localhost:3000/images/default_profilepic.jpeg"
	// 		) {
	// 			const oldImage =
	// 				path.resolve(__dirname, "../images") +
	// 				oldImageData.replace("http://localhost:3000/images", "");

	// 			if (fs.existsSync(oldImage)) {
	// 				fs.unlink(oldImage, (err) => {
	// 					if (err) {
	// 						console.error(err);
	// 						return;
	// 					}
	// 				});
	// 			}
	// 		}
	// 		var sql =
	// 			"DELETE FROM user_pictures WHERE user_id = $1 AND picture_id = $2";
	// 		await pool.query(sql, [sess.userid, picture_id]);
	// 		var sql = `UPDATE fame_rates SET picture_pts = picture_pts - 2, total_pts = total_pts - 2
	// 					WHERE user_id = $1 AND picture_pts > 0`;
	// 		await pool.query(sql, [sess.userid]);
	// 		response.status(200).send("Picture deleted");
	// 	}
	// });

	app.delete("/api/profile/deleteuser", async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			const getId = "SELECT * FROM users WHERE token = $1";
			const { rows } = await pool.query(getId, [cookie]);
			const id = rows[0]["id"];
			try {
				var sql = `DELETE FROM users WHERE id = $1`;
				pool.query(sql, [id]);
				response.send(true);
			} catch (error) {
				console.log(error);
				response.send("Failed to delete user!");
			}
		}
	});
};

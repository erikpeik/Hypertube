module.exports = function (app, pool, bcrypt, cookieParser, bodyParser, jwt) {
  app.post("/api/login", async (request, response) => {
    const { username, password } = request.body;

    // const verifyUser = async () => {
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
          const userId = rows[0]['id'];
          const name = rows[0]['username'];
          const email = rows[0]['email'];

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
		  const cookie = response.cookie("refreshToken", refreshToken, {
			httpOnly: false,
			maxAge: 24 * 60 * 60 * 1000,
		  });

		  response.json({ accessToken, username: name, userid: userId });
          console.log(cookie)
        } else throw "Wrong password!";
      }
    // };

    // verifyUser()
    //   .then((sess) => {
    //     response.send(sess);
    //   })
    //   .catch((error) => {
    //     response.send(error);
    //   });
  });

//   app.get("/api/login", (request, response) => {
//     var sess = request.session;
//     if (sess.username && sess.userid)
//       response.send({ name: sess.username, id: sess.userid });
//     else response.send("");
//   });

  app.get("/api/logout", async(request, response) => {
    request.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      response.end();
    });
  });

//   app.get("/api/logout", async (request, response) => {
//     const refreshToken = request.cookies.refreshToken;
//     if (!refreshToken) return response.sendStatus(204);
//     var sql = `SELECT * FROM users WHERE token = $1`;
//     const { rows } = await pool.query(sql, [refreshToken]);
//     if (rows.length !== 0) {
// 		console.log('here')
//       const userId = rows[0]["id"];
//       const sql = `UPDATE users SET token = $1 WHERE id = $2`;
//       const { rows } = await pool.query(sql, [0, userId]);
//       response.clearCookie("refreshToken");
//     }
//   });
};

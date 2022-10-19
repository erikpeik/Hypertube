require("dotenv").config(); // to use .env variables
const express = require("express");
const app = express();
const cors = require("cors"); // Cross-origin resource sharing (CORS) middleware is required to allow requests from other origins
const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" })); // needed to attach JSON data to POST body property
const nodemailer = require("nodemailer"); // middleware to send e-mails
const bcrypt = require("bcrypt"); // For password hashing and comparing
const session = require("express-session"); // for session management
app.use(
	session({
		secret: "hypertubec2r2p6",
		saveUninitialized: true,
		resave: true,
	})
);
const http = require("http").Server(app);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const { Pool } = require("pg");
const pool = new Pool({
	user: "hypertube",
	host: "postgres-db",
	database: "hypertube",
	password: "root",
	port: 5432,
});

const connectToDatabase = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.log("Error acquiring client", err.stack);
			console.log("Retrying in 5 seconds...");
			setTimeout(connectToDatabase, 5000);
		} else {
			console.log("Connected to database");
		}
	});
};
connectToDatabase();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const helperFunctions = require("./utils/helperFunctions.js");
require("./routes/signup.js")(app, pool, bcrypt, transporter, helperFunctions);
require("./routes/login_logout.js")(
	app,
	pool,
	bcrypt,
	cookieParser,
	bodyParser,
	jwt
);
require("./routes/resetpassword.js")(app, pool, bcrypt, transporter);
require("./routes/profile.js")(app, pool, bcrypt);

app.get("/", (req, res) => {
	res.send("Welcome to Hypertube");
});

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

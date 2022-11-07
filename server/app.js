require('dotenv').config(); // to use .env variables
const express = require('express');
const app = express();
const axios = require('axios');
app.use('/images', express.static('./images')); // to serve static files to path /images, from images folder
const cors = require('cors'); // Cross-origin resource sharing (CORS) middleware is required to allow requests from other origins
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' })); // needed to attach JSON data to POST body property
const nodemailer = require('nodemailer'); // middleware to send e-mails
const bcrypt = require('bcrypt'); // For password hashing and comparing

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const multer = require('multer'); // for image upload and storage
const fs = require('fs'); // for deleting the files from the server
const path = require('path');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

const { Pool } = require('pg');
const pool = new Pool({
	user: 'hypertube',
	host: 'postgres-db',
	database: 'hypertube',
	password: 'root',
	port: 5432,
});

const ffmpeg = require('fluent-ffmpeg');

const connectToDatabase = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.log('Error acquiring client', err.stack);
			console.log('Retrying in 5 seconds...');
			setTimeout(connectToDatabase, 5000);
		} else {
			console.log('Connected to database');
		}
	});
};
connectToDatabase();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images/');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});
const upload = multer({ storage: storage });

const helperFunctions = require('./utils/helperFunctions.js');
require('./routes/signup.js')(app, pool, bcrypt, transporter, helperFunctions);
require('./routes/login_logout.js')(app, pool, bcrypt, jwt, helperFunctions);
require('./routes/resetpassword.js')(app, pool, bcrypt, transporter, helperFunctions);
require('./routes/profile.js')(app, pool, bcrypt, upload, fs, path, helperFunctions);
require('./routes/browsing.js')(app, axios);
require('./routes/oauth.js')(app, pool, axios, helperFunctions, jwt);
require('./routes/streaming.js')(app, fs, path, axios, pool, ffmpeg);
require('./routes/comments.js')(app, pool);
require('./routes/movies.js')(app, pool, axios);

app.get('/', (req, res) => {
	res.send('Welcome to Hypertube');
});

module.exports = app;

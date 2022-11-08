CREATE TYPE enum_yesno AS ENUM ('YES', 'NO');
SET TIME ZONE 'Europe/Helsinki';

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	language VARCHAR(255) DEFAULT 'en',
	password VARCHAR(255) NOT NULL,
	verified enum_yesno DEFAULT 'NO',
	token VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS email_verify (
	running_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	email VARCHAR(255) NOT NULL,
	verify_code VARCHAR(255) NOT NULL,
	expire_time TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + interval '30 minutes'),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset (
	running_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	reset_code VARCHAR(255) NOT NULL,
	expire_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_pictures (
	picture_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	picture_data TEXT NOT NULL,
	profile_pic enum_yesno DEFAULT 'NO',
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS downloads (
	file_id SERIAL NOT NULL PRIMARY KEY,
	path VARCHAR(1000) NOT NULL,
	file_type VARCHAR(10) NOT NULL,
	file_size BIGINT NOT NULL,
	completed enum_yesno DEFAULT 'NO',
	imdb_id VARCHAR(15) NOT NULL,
	quality VARCHAR(10) NOT NULL,
	download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	username VARCHAR(100) NOT NULL,
	user_pic TEXT NOT NULL,
	imdb_id TEXT NOT NULL,
	comment TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subtitles (
	id SERIAL NOT NULL PRIMARY KEY,
	imdb_id VARCHAR(15) NOT NULL,
	language VARCHAR(3) NOT NULL,
	path TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies_watched (
	id SERIAL NOT NULL PRIMARY KEY,
	imdb_id VARCHAR(15) NOT NULL,
	user_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

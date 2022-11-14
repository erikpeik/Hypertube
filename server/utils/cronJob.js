const cron = require('node-cron');
const fs = require('fs');
const path = require('node:path');

module.exports = function (pool) {
	function get() {
		const current_date = Date.now();
		const month_ago = new Date(current_date - 2592000000)
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
		let sql = `SELECT t.imdb_id, t.created_at, d.path
		FROM (
			SELECT * FROM movies_watched
			WHERE (imdb_id, created_at) in (
				SELECT imdb_id, MAX(created_at)
				FROM movies_watched
				GROUP BY imdb_id
			)
		) t
		INNER JOIN downloads d ON d.imdb_id = t.imdb_id
		WHERE t.created_at <= $1 AND d.completed = 'YES'`;
		pool.query(sql, [month_ago], (err, result) => {
			if (err) throw err;
			result.rows.forEach((element) => {
				const element_path = element.path.split('/');
				const folder_path = path.resolve(
					__dirname,
					`../movies/${element_path[1]}`
				);
				if (fs.existsSync(folder_path)) {
					fs.rmSync(folder_path, { recursive: true });
				}
				sql = `DELETE FROM downloads WHERE imdb_id = $1`;
				pool.query(sql, [element.imdb_id]);
				sql = `DELETE FROM subtitles WHERE imdb_id = $1`;
				pool.query(sql, [element.imdb_id]);
			});
		});
	}
	function crontab() {
		cron.schedule(
			'0 8 * * *', // '*/1 * * * * *', // every second for testing
			function () {
				get();
			},
			{
				scheduled: true,
				timezone: 'Europe/Helsinki',
			}
		);
	}
	crontab();
};

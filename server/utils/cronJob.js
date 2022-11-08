const cron = require('node-cron');
const fs = require('fs');
const path = require('node:path');

module.exports = function (app, pool, axios) {
	function get() {
		let sql = `SELECT t.imdb_id, t.created_at, d.path
				FROM (
					SELECT * FROM movies_watched
					WHERE (imdb_id, created_at) in (
						SELECT imdb_id, MAX(created_at)
						FROM movies_watched
						GROUP BY imdb_id
						)
					) t
				LEFT JOIN downloads d ON d.imdb_id = t.imdb_id`;
		pool.query(sql, (err, result) => {
			if (err) throw err;
			console.log(result.rows);
			result.rows.forEach((element) => {
				let current_date = Date.now();
				// console.log('CURRENTDATE: ', current_date);
				// console.log('OLDDATE: ', element.created_at);
				let date1 = new Date(element.created_at).getTime();
				// console.log('OLDDATE: ', date1);
				let addedOldDate = date1 + 2592000000;
				// console.log('+30days: ', addedOldDate);
				if (addedOldDate < current_date) {
					console.log('older than 30 days'); // go back in time
					sql = `DELETE FROM movies_watched WHERE imdb_id = $1`;
					pool.query(sql, [element.imdb_id]);
					const element_path = element.path.split('/');
					const folder_path = path.resolve(
						__dirname,
						`../movies/${element_path[1]}`
					);
					console.log('folder_path', folder_path);
					if (fs.existsSync(folder_path)) {
						fs.rmSync(folder_path, { recursive: true });
					}
					sql = `DELETE FROM downloads WHERE imdb_id = $1`;
					pool.query(sql, [element.imdb_id]);
				} else {
					console.log('not older than 30 days');
				}
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
// module.export = { crontab };

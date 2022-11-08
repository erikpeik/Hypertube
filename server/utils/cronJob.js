const cron = require('node-cron');
module.exports = function (app, pool, axios) {

	function get() {
		let sql = `SELECT created_at FROM movies_watched`;
		pool.query(sql, (err, result) => {
			if (err) throw err;
			console.log(result.rows);
			result.rows.forEach((element) => {
				var today = new Date();
				var currentDate =
					today.getFullYear() +
					'/' +
					(today.getMonth() + 1) +
					'/' +
					today.getDate();
				let date2 = new Date(currentDate).getTime();
				console.log('CURRENTDATE: ', date2);
				console.log('OLDDATE: ', element.created_at);
				let date1 = new Date(element.created_at).getTime();
				console.log('OLDDATE: ', date1);
				let addedOldDate = date1 + 2592000000;
				console.log('+30days: ', addedOldDate);
				if (date1 < date2) {
					console.log('older than 30 days'); // go back in time
					sql = `DELETE FROM movies_watched WHERE created_at = $1`;
					pool.query(sql, [element.created_at]);
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
				get()
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

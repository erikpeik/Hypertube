const cron = require('node-cron');

function crontab(oldDate) {
	cron.schedule(
		'*/1 * * * * *',
		function () {
			var today = new Date();
			var currentDate =
				today.getFullYear() +
				'-' +
				(today.getMonth() + 1) +
				'-' +
				today.getDate();

			let sql = `SELECT  TO_CHAR(created_at, 'YYYY/MM/DD') AS created_at FROM movies_watched`;

			pool.query(sql, (err, result) => {
				if (err) throw err;
				console.log(result.rows);
				result.rows.forEach((element) => {
					// ================== CRON JOB BROKEN ==================
					// if (cronJob.crontab(element.created_at) === true) {
					// 	console.log('true');
					// } else {
					// 	console.log('false');
					// }
					// ================================
					console.log('---------------------');
					if (
						compareDates(element.created_at, currentDate) === true
					) {
						console.log('true');
						sql = `DELETE FROM movies_watched WHERE created_at = $1`;
						pool.query(sql, [element.created_at]);
					} else {
						console.log('false');
						return false;
					}
					console.log('============');
					console.log(element.created_at);
					console.log('============');
				});
			});
		},
		{
			scheduled: true,
			timezone: 'Europe/Helsinki',
		}
	);
}

const compareDates = (oldDate, newDate) => {
	let date1 = new Date(oldDate).getTime();
	let date2 = new Date(newDate).getTime();

	if (date1 < date2) {
		console.log(`${oldDate} is less than ${newDate}`);
		return new Date(newDate) - new Date(oldDate) > 86400000;
	} else {
		return false;
	}
	// else if (date1 > date2) {
	// 	console.log(`${oldDate} is greater than ${newDate}`);
	// } else {
	// 	console.log(`Both dates are equal`);
	// }
};

var oldDate = '2022-1-1';

crontab(oldDate);
module.export = { crontab };

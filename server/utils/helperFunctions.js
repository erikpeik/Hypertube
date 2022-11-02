function makeToken(length) {
	var result = '';
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

const translate = async (text, pool) => {
	const API_KEY = process.env.GOOGLE_API_KEY;
	const cookie = request.cookies.refreshToken;

	let fromLang = 'en';
	let toLang;
	if (cookie) {
		let sql = 'SELECT * FROM users WHERE token = $1';
		let { rows } = await pool.query(sql, [cookie]);
		toLang = rows[0]['language'];
	} else toLang = 'en';

	let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
	url += '&q=' + encodeURI(text);
	url += `&source=${fromLang}`;
	url += `&target=${toLang}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const result = await res.json();
	return result.data['translations'][0].translatedText;
};

module.exports = { makeToken, translate };

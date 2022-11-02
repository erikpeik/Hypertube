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

const translate = async (text, pool, toLang) => {
	const API_KEY = process.env.GOOGLE_API_KEY;
	let fromLang = 'en';

	// const cookie = request.cookies.refreshToken;

	// let toLang;
	// if (cookie) {
	// 	let sql = 'SELECT * FROM users WHERE token = $1';
	// 	let { rows } = await pool.query(sql, [cookie]);
	// 	toLang = rows[0]['language'];
	// }

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
	if (result.data) {
		return result.data['translations'][0].translatedText;
	} else return text;
};

module.exports = { makeToken, translate };

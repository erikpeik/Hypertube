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
	let fromLang = 'en';
	let toLang;

	const sql = `SELECT * FROM  users SET verified = 'YES' WHERE username = $1`;
			pool.query(sql, [username]);
	const API_KEY = process.env.GOOGLE_API_KEY;

	let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
	url += '&q=' + encodeURI(text);
	url += `&source=${fromLang}`;
	url += `&target=${toLang}`;
	const rows = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const result = await rows.json();
	return result.data['translations'][0].translatedText;
};

module.exports = { makeToken, translate };

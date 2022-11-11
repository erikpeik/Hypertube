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

const checkValidLanguage = language => {
	if (language === 'en' || language === 'fi' || language === 'hu' || language === 'ro')
		return true
	else
		return 'Faulty language information';
}

module.exports = { makeToken, translate, checkValidLanguage };

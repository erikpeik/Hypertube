const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('null data in new comment', async () => {
	const data = null

	await api
		.post('/api/newcomment/tt2779318')
		.send(data)
		.expect('Comment missing');
});

test('empty comment', async () => {
	const data = { comment: '' };

	await api
		.post('/api/newcomment/tt2779318')
		.send(data)
		.expect('Comment missing');
});

test('too long imdb_id', async () => {
	const data = { comment: 'Comment' };

	await api
		.post('/api/newcomment/tt277932319023183029123118')
		.send(data)
		.expect('Faulty imdb_id');
});

test('too long comment', async () => {
	const data = { comment: 'HWDHIUDWQIUHDWQUIHuwueiowqjqweoijqweoijewqoipjqewjej812e29j12e8j289HWDHIUDWQIUHDWQUIHuwueiowqjqweoijqweoijewqoipjqewjej812e29j12e8j289ejweijqweojeqwiojeqoijeioqjiojowvuwefjweiojerwoijwreiojrewoijrwoeipqjwreoiqpjwerqoijrweqoijwerqoipjweqopirjweoirjweqopirjoipwerjoiweqrjopiweqjroiweqjropiweqjroipwqejroiwqejroiweqjroiweqjroiwqejroiweqjropiwqejropiqwejropiweqjroipweqrjoipwqejroiwqejroiewqrjopiwqejropiwqerjHWDHIUDWQIUHDWQUIHuwueiowqjqweoijqweoijewqoipjqewjej812e29j12e8j289ejweijqweojeqwiojeqoijeioqjiojowvuwefjweiojerwoijwreiojrewoijrwoeipqjwreoiqpjwerqoijrweqoijwerqoipjweqopirjweoirjweqopirjoipwerjoiweqrjopiweqjroiweqjropiweqjroipwqejroiwqejroiweqjroiweqjroiwqejroiweqjropiwqejropiqwejropiweqjroipweqrjoipwqejroiwqejroiewqrjopiwqejropiwqerjejweijqweojeqwiojeqoijeioqjiojowvuwefjweiojerwoijwreiojrewoijrwoeipqjwreoiqpjwerqoijrweqoijwerqoipjweqopirjweoirjweqopirjoipwerjoiweqrjopiweqjroiweqjropiweqjroipwqejroiwqejroiweqjroiweqjroiwqejroiweqjropiwqejropiqwejropiweqjroipweqrjoipwqejroiwqejroiewqrjopiwqejropiwqerj' };

	await api
		.post('/api/newcomment/tt2779318')
		.send(data)
		.expect('Maximum length for comments is 500 characters.');
});

test('too long imdb_id in get comments', async () => {
	const data = { comment: 'HWDHIUDWQIUHDWQUIHuwueiowqjqweoijqweoijewqoipjqewjej812e29j12e8j289HWDHIUDWQIUHDWQUIHuwueiowqjqweoijqweoijewqoipjqewjej812e29j12e8j289ejweijqweojeqwiojeqoijeioqjiojowvuwefjweiojerwoijwreiojrewoijrwoeipqjwreoiqpjwerqoijrweqoijwerqoipjweqopirjweoirjweqopirjoipwerjoiweqrjopiweqjroiweqjropiweqjroipwqejroiwqejroiweqjroiweqjroiwqejroiweqjropiwqejropiqwejropiweqjroipweqrjoipwqejroiwqejroiewqrjopiwqejropiwqerjHWDHIUDWQIUHDWQUIHuwueiowqjqweoijqweoijewqoipjqewjej812e29j12e8j289ejweijqweojeqwiojeqoijeioqjiojowvuwefjweiojerwoijwreiojrewoijrwoeipqjwreoiqpjwerqoijrweqoijwerqoipjweqopirjweoirjweqopirjoipwerjoiweqrjopiweqjroiweqjropiweqjroipwqejroiwqejroiweqjroiweqjroiwqejroiweqjropiwqejropiqwejropiweqjroipweqrjoipwqejroiwqejroiewqrjopiwqejropiwqerjejweijqweojeqwiojeqoijeioqjiojowvuwefjweiojerwoijwreiojrewoijrwoeipqjwreoiqpjwerqoijrweqoijwerqoipjweqopirjweoirjweqopirjoipwerjoiweqrjopiweqjroiweqjropiweqjroipwqejroiwqejroiweqjroiweqjroiwqejroiweqjropiwqejropiqwejropiweqjroipweqrjoipwqejroiwqejroiewqrjopiwqejropiwqerj' };

	await api
		.get('/api/getcomments/tt277932319023183029123118')
		.send(data)
		.expect('Faulty imdb_id');
});

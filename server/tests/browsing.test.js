const supertest = require('supertest');
const { notify } = require('../app');
const app = require('../app');

const api = supertest(app);

test('empty imdb_data', async () => {
	const data = null

	await api
		.post('/api/browsing/imdb_data')
		.send(data)
		.expect({"error": "Invalid IMDB_code"});
});

test('null imdb_data', async () => {
	const data = { imdb_id: null}

	await api
		.post('/api/browsing/imdb_data')
		.send(data)
		.expect({"error":"Invalid IMDB_code"});
});

test('imdb data with faulty id', async () => {
	const data = { imdb_id: 'xxx1129018201'}

	await api
		.post('/api/browsing/imdb_data')
		.send(data)
		.expect({"error":"Invalid IMDB_code"});
});

test('imdb data with improbable id', async () => {
	const data = { imdb_id: 'tt99999999'}

	await api
		.post('/api/browsing/imdb_data')
		.send(data)
		.expect({"error":"Something went wrong"});
});

test('empty movie query', async () => {
	const data = null

	await api
		.post('/api/browsing/movie_query')
		.send(data)
		.expect({ error: 'Page number missing' });
});

test('movie query with just page', async () => {
	const data = { page: 1 }

	await api
		.post('/api/browsing/movie_query')
		.send(data)
		.expect({error: 'Something went wrong'});
});

test('movie query with random values', async () => {
	const data = {
		query: '93280812309823190231dsksaldk#&$#(@*$asd',
		genre: '87491238uuewioije#@#@wiqjewq',
		sort_by: 'Iuioeqwuioewquioewqj',
		order_by: '2319083219082309wqeijsklad',
		imdb_rating: '92013809231032kwee',
		page: 1 }

	await api
		.post('/api/browsing/movie_query')
		.send(data)
		.expect({error: 'Something went wrong'});
});

test('single movie query with faulty id', async () => {
	await api
		.get('/api/browsing/movie_query/328190231890123890231')
		.expect({
			error: 'Something went wrong with faulty movie_query ID',
		});
});

test('recommended movies with faulty id', async () => {
	await api
		.get('/api/browsing/recommended_movies/328190231890123890231assa')
		.expect({
			error: 'Movie not found',
		});
});

test('check image with null data', async () => {
	const data = null

	await api
		.post('/api/browsing/check_image')
		.send(data)
		.expect({ status: 'failed' });
});

test('check image with random url', async () => {
	const data = { url: 'djoiwqdjiodwqjdslalkasdjqwieoueq21'}

	await api
		.post('/api/browsing/check_image')
		.send(data)
		.expect({ status: 'failed' });
});

test('check image with working url', async () => {
	const data = { url: 'https://profile.intra.42.fr/'}

	await api
		.post('/api/browsing/check_image')
		.send(data)
		.expect({ status: 'true' });
});


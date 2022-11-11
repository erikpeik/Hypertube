const supertest = require('supertest');
const { notify } = require('../app');
const app = require('../app');

const api = supertest(app);

test('imdb data with faulty id', async () => {
	const data = { imdb_id: 'xxx1129018201'}

	await api
		.post('/api/browsing/imdb_data')
		.send(data)
		.expect('Invalid IMDB_code');
});

// OMDB API KEY NOT WORKING
// test('imdb data with improbable id', async () => {
// 	const data = { imdb_id: 'tt99999999'}

// 	await api
// 		.post('/api/browsing/imdb_data')
// 		.send(data)
// 		.expect('Movie not found on database');
// });

// test('movie query with null data', async () => {
// 	const data = null

// 	await api
// 		.post('/api/browsing/movie_query')
// 		.expect('Required movie query data missing');
// });

// test('movie query with null variables', async () => {
// 	const data = {
// 		query: null,
// 		genre: null,
// 		sort_by: null,
// 		order_by: null,
// 		imdb_rating: null,
// 		page: null
// 	}

// 	await api
// 		.post('/api/browsing/movie_query')
// 		.send(data)
// 		.expect('Required movie query data missing');
// });


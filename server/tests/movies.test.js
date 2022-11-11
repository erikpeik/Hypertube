const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

//change cookie to your current token
let cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InBsZWh0aWthIiwibWFpbCI6InBsZWh0aWthQHN0dWRlbnQuaGl2ZS5maSIsImlhdCI6MTY2ODA4NDcxNywiZXhwIjoxNjY4MTcxMTE3fQ.C7mNRy4S1RNEWJrMJEplSNSJFKVZ_oEkA29h7tYisuA'

test('movie watch with no cookie', async () => {
	const data = null

	await api
		.post('/api/movies/watch/tt2779318')
		.send(data)
		.expect('User not signed in!');
});

test('movie watch with false cookie', async () => {
	const data = null

	await api
		.post('/api/movies/watch/tt2779318')
		.set('Cookie', [`refreshToken=somethingtotallyfake`])
		.send(data)
		.expect('User not signed in!');
});

test('movie watch with false userid', async () => {
	const data = { userId: 'thiswillneverexist123890'}

	await api
		.post('/api/movies/watch/tt2779318')
		.set('Cookie', [`refreshToken=${cookie}`])
		.send(data)
		.expect('User id and token do not match!');
});

test('movie watch with faulty imdb_id', async () => {
	const data = { userId: 1}

	await api
		.post('/api/movies/watch/xt2779318')
		.set('Cookie', [`refreshToken=${cookie}`])
		.send(data)
		.expect('Faulty Imdb_id!');
});

test('watched movies with false userid', async () => {
	const data = { userId: 'thiswillneverexist123890'}

	await api
		.post('/api/movies/watch')
		.set('Cookie', [`refreshToken=${cookie}`])
		.send(data)
		.expect([]);
});

test('single movie details with false imdb_id', async () => {
	await api
		.get('/api/movies/xt2779318')
		.set('Cookie', [`refreshToken=${cookie}`])
		.expect('Faulty Imdb_id!');
});

test('single movie details with improbable imdb_id', async () => {
	await api
		.get('/api/movies/tt0000000')
		.set('Cookie', [`refreshToken=${cookie}`])
		.expect('No such movie in collection');
});


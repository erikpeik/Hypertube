const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

// change cookie to your current token
let cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InBsZWh0aWthIiwibWFpbCI6InBsZWh0aWthQHN0dWRlbnQuaGl2ZS5maSIsImlhdCI6MTY2ODA4NDcxNywiZXhwIjoxNjY4MTcxMTE3fQ.C7mNRy4S1RNEWJrMJEplSNSJFKVZ_oEkA29h7tYisuA'

test('moviestream with random quality', async () => {
	await api
		.get('/api/moviestream/tt2779318/4960p')
		.expect("Invalid movie quality")
})

// requires database access
test('moviestream with impossible imdb_id', async () => {
	await api
		.get('/api/moviestream/tt2779318*JWLKWE/1080p')
		.expect("Invalid IMDB_code")
})

test('moviestream with random imdb_id', async () => {
	await api
		.get('/api/moviestream/tt9999999/1080p')
		.expect("Faulty Movie ID or quality")
})

test('subtext with faulty language', async () => {
	await api
		.get('/api/streaming/subtext/tt2779318/greekish-german')
		.expect("Faulty language option")
})

// requires database access
test('subtext with random id', async () => {
	await api
		.get('/api/streaming/subtext/tt2779318312890!(@)po/en')
		.expect("Invalid IMDB_code")
})

test('subtitle search with random id', async () => {
	await api
		.get('/api/streaming/subs/tt277931881320981230981320983120jdjadslkjq*(!&#@(*#@!&));lejads-p"ds;salj')
		.expect([])
})

test('torrent download with random quality', async () => {
	await api
		.get('/api/streaming/torrent/tt2779318/4960p')
		.set('Cookie', [`refreshToken=${cookie}`])
		.expect("Invalid movie quality")
})

test('torrent download with faulty imdb id', async () => {
	await api
		.get('/api/streaming/torrent/0tt2779318/1080p')
		.set('Cookie', [`refreshToken=${cookie}`])
		.expect("Invalid IMDB_code")
})

test('torrent download with no cookie', async () => {
	await api
		.get('/api/streaming/torrent/tt2779318/1080p')
		.expect("User not signed in!")
})

test('torrent download with false cookie', async () => {
	await api
		.get('/api/streaming/torrent/tt2779318/1080p')
		.set('Cookie', [`refreshToken=somethingtotallyfake`])
		.expect("User not signed in!")
})

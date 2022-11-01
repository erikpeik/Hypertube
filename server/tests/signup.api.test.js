const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('null as profile data', async () => {
	const newUser = null

	await api
		.post('/api/signup')
		.send(newUser)
		// .expect(400)
		.expect("Required profile data missing")
		// .expect('Content-Type', /application\/json/)
})

test('empty profile data', async () => {
	const newUser = {}

	await api
		.post('/api/signup')
		.send(newUser)
		// .expect(400)
		.expect("Required profile data missing")
		// .expect('Content-Type', /application\/json/)
})

test('faulty username characters', async () => {
	const newUser = {
		username: '&@(!*#&@()*&@#!(*)&',
		firstname: 'TEHOwrweq',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Username should only include characters (a-z or A-Z) and numbers (0-9).")
		// .expect('Content-Type', /application\/json/)
})


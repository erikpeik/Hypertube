const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('null as profile data', async () => {
	const newUser = null

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Required profile data missing")
})

test('empty profile data', async () => {
	const newUser = {}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Required profile data missing")
})

test('null profile values', async () => {
	const newUser = {
		username: undefined,
		firstname: undefined,
		lastname: undefined,
		email: undefined,
		language: null
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Required profile data missing")
		// .expect('Content-Type', /application\/json/)
})

test('too short username', async () => {
	const newUser = {
		username: 'Ana',
		firstname: 'TEHOwrweq',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Username has to be between 4 and 25 characters.")
})

test('too long username', async () => {
	const newUser = {
		username: '12345678901234567890123456',
		firstname: 'TEHOwrweq',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Username has to be between 4 and 25 characters.")
})

test('faulty username characters', async () => {
	const newUser = {
		username: '&@(!*#&@()*&@#!(*)&',
		firstname: 'TEHOwrweq',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Username should only include characters (a-z or A-Z) and numbers (0-9).")
})

test('too long firstname', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'sahkshafkjhdsfkjhalsdfkhdfklsajhdafskljhkldjsafhklsdfjahklasfdhkldsfahkljdfhs',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Come on, your name can't seriously be that long. Maximum for first name and last name is 50 characters.")
})

test('too long lastname', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'sahkshafkjhdsfkjhalsdfkhdfklsajhdafskljhkldjsafhklsdfjahklasfdhkldsfahkljdfhs',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Come on, your name can't seriously be that long. Maximum for first name and last name is 50 characters.")
})

test('faulty firstname characters', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi1',
		lastname: 'testi',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("First name and last name can only include characters a-z, å, ä, ö and dash (-).")
})

test('faulty lastname characters', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi1',
		email: 'testi@testi.com',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("First name and last name can only include characters a-z, å, ä, ö and dash (-).")
})

test('too long email', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: '12uu1o23io213uoi231uoi123uio213uoi213uoi123uoiu213iou23oiu123opu132oipu231oipu2o13ipuoi213upo2i31uoip231uoip231uoip2u13oipu213oipu231oipu213oipu231oiu231opiu231poiu231oipu231opiu213poiu123oipu123poiu12p3o',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Please enter a valid e-mail address.")
})

test('faulty email characters', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite<>@fkl.fi',
		language: 'en'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Please enter a valid e-mail address.")
})

test('faulty language info', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		language: 'romanian-hungarian with finnish-dialect'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Faulty language information")
})


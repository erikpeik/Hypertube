const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('null as profile data', async () => {
	const newUser = null

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Required profile data missing")
})

test('empty profile data', async () => {
	const newUser = {}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Required profile data missing")
})

test('null profile values', async () => {
	const newUser = {
		username: undefined,
		firstname: undefined,
		lastname: undefined,
		email: undefined,
		password: undefined,
		confirmPassword: undefined,
		language: undefined
	}

	await api
		.post('/api/signup')
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
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Username has to be between 4 and 25 characters.")
})

test('too long username', async () => {
	const newUser = {
		username: '12345678901234567890123456',
		firstname: 'TEHOwrweq',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Username has to be between 4 and 25 characters.")
})

test('faulty username characters', async () => {
	const newUser = {
		username: '&@(!*#&@()*&@#!(*)&',
		firstname: 'TEHOwrweq',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Username should only include characters (a-z or A-Z) and numbers (0-9).")
})

test('too long firstname', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'sahkshafkjhdsfkjhalsdfkhdfklsajhdafskljhkldjsafhklsdfjahklasfdhkldsfahkljdfhs',
		lastname: 'JO@EJ@EO',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Come on, your name can't seriously be that long. Maximum for first name and last name is 50 characters.")
})

test('too long lastname', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'sahkshafkjhdsfkjhalsdfkhdfklsajhdafskljhkldjsafhklsdfjahklasfdhkldsfahkljdfhs',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Come on, your name can't seriously be that long. Maximum for first name and last name is 50 characters.")
})

test('faulty firstname characters', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi1',
		lastname: 'testi',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("First name and last name can only include characters a-z, å, ä, ö and dash (-).")
})

test('faulty lastname characters', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi1',
		email: 'testi@testi.com',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("First name and last name can only include characters a-z, å, ä, ö and dash (-).")
})

test('too long email', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: '12uu1o23io213uoi231uoi123uio213uoi213uoi123uoiu213iou23oiu123opu132oipu231oipu2o13ipuoi213upo2i31uoip231uoip231uoip2u13oipu213oipu231oipu213oipu231oiu231opiu231poiu231oipu231opiu213poiu123oipu123poiu12p3o',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Please enter a valid e-mail address.")
})

test('faulty email characters', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite<>@fkl.fi',
		password: 'whateva',
		confirmPassword: 'whateva',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Please enter a valid e-mail address.")
})

test('too short password', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		password: '1234',
		confirmPassword: '1234',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("PLEASE ENTER A PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character, at least one uppercase character, at least one numeric character and at least one special character")
})

test('too long password', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		password: '1234abcdefg3712987312983721891327908312790',
		confirmPassword: '1234abcdefg3712987312983721891327908312790',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("PLEASE ENTER A PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character, at least one uppercase character, at least one numeric character and at least one special character")
})

test('too simple password', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		password: '1234abcdefg',
		confirmPassword: '1234abcdefg',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("PLEASE ENTER A PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character, at least one uppercase character, at least one numeric character and at least one special character")
})

test('passwords not matching', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		password: '1234ABC&&&bx2',
		confirmPassword: '1234ABC&&&bx1',
		language: 'en'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("The entered passwords are not the same!")
})

test('faulty language info', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		password: '1234ABC&&&bx2',
		confirmPassword: '1234ABC&&&bx1',
		language: 'romanian-hungarian with finnish-dialect'
	}

	await api
		.post('/api/signup')
		.send(newUser)
		.expect("Faulty language information")
})

// remember to delete the user after each try //

// test('Successful username creation', async () => {
// 	const newUser = {
// 		username: 'testi',
// 		firstname: 'testi',
// 		lastname: 'testi',
// 		email: 'oikeaosoite@fkl.fi',
// 		password: '1234ABC&&&bx1',
// 		confirmPassword: '1234ABC&&&bx1'
// 	}

// 	await api
// 		.post('/api/signup')
// 		.send(newUser)
// 		.expect('true')
// })

test('null as verify user', async () => {
	const newUser = null

	await api
		.post('/api/signup/verifyuser')
		.send(newUser)
		.expect("Required verify data missing")
})

test('empty values as verify user', async () => {
	const newUser = {
		username: null,
		code: undefined
	}

	await api
		.post('/api/signup/verifyuser')
		.send(newUser)
		.expect("Required verify data missing")
})


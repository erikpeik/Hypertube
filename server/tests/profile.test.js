const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const fs = require('fs')

// change cookie to your current token
let cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InBsZWh0aWthIiwibWFpbCI6InBsZWh0aWthQHN0dWRlbnQuaGl2ZS5maSIsImlhdCI6MTY2ODQzODMwMSwiZXhwIjoxNjY4NTI0NzAxfQ.hCcfhu5omUuB_Un3gDeYa1s9SdM0mUzsoATGLFxAPcw'

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
		language: null,
		infiniteScroll: null
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'en',
		infiniteScroll: 'YES'
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
		language: 'romanian-hungarian with finnish-dialect',
		infiniteScroll: 'YES'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Faulty language information")
})

test('faulty infinitescroll', async () => {
	const newUser = {
		username: 'testi',
		firstname: 'testi',
		lastname: 'testi',
		email: 'oikeaosoite@fkl.fi',
		language: 'en',
		infiniteScroll: 'YES, ALWAYS INFINITE SCROLL'
	}

	await api
		.post('/api/profile/editsettings')
		.send(newUser)
		.expect("Faulty infinite scroll information")
})

test('null as change password data', async () => {
	const data = null

	await api
		.post('/api/profile/changepassword')
		.send(data)
		.expect("Required password data missing")
})

test('null values as change password data', async () => {
	const data = {
		oldPassword: null,
		newPassword: undefined,
		confirmPassword: null,
		language: undefined
	}

	await api
		.post('/api/profile/changepassword')
		.send(data)
		.expect("Required password data missing")
})

test('faulty language in change password data', async () => {
	const data = {
		oldPassword: 'Testi123&&&',
		newPassword: 'Testi456&&&',
		confirmPassword: 'Testi456&&&',
		language: 'romanian-hungarian with finnish-dialect'
	}

	await api
		.post('/api/profile/changepassword')
		.send(data)
		.expect("Faulty language information")
})

test('different passwords in change password data', async () => {
	const data = {
		oldPassword: 'Testi123&&&',
		newPassword: 'Testi456&&&',
		confirmPassword: 'Testi456&&&1',
		language: 'en'
	}

	await api
		.post('/api/profile/changepassword')
		.send(data)
		.expect("The entered new passwords are not the same!")
})

test('faulty new password in change password data', async () => {
	const data = {
		oldPassword: 'Testi123&&&',
		newPassword: '456&&&',
		confirmPassword: '456&&&',
		language: 'en'
	}

	await api
		.post('/api/profile/changepassword')
		.send(data)
		.expect("PLEASE ENTER A NEW PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character (a-z), at least one uppercase character (A-Z), at least one numeric character (0-9) and at least one special character")
})

test('null as profile pic data', async () => {
	const data = null

	await api
		.post('/api/profile/setprofilepic/en')
		.send(data)
		.expect("Required profile pic data missing")
})

test('null as profile pic data', async () => {
	const data = null

	await api
		.post('/api/profile/setprofilepic/en')
		.send(data)
		.expect("Required profile pic data missing")
})

test('faulty language in profile pic data', async () => {
	const data = null

	await api
		.post('/api/profile/setprofilepic/enkkuu')
		.send(data)
		.expect("Faulty language information")
})

test('profile get with no cookie', async () => {
	await api
		.get('/api/profile')
		.expect('false')
})

test('profile get with false cookie', async () => {
	await api
		.get('/api/profile')
		.set('Cookie', [`refreshToken=somethingtotallyfake`])
		.expect('false')
})

test('deleteuser with no cookie', async () => {
	const data = null

	await api
		.delete('/api/profile/deleteuser')
		.send(data)
		.expect('false')
})

//requires database access
test('deleteuser with false cookie', async () => {
	const data = null

	await api
		.delete('/api/profile/deleteuser')
		.set('Cookie', [`refreshToken=somethingtotallyfake`])
		.send(data)
		.expect('Failed to delete user!')
})


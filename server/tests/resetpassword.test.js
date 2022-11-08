const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('null as reset password data', async () => {
	const data = null

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Reset values missing")
})

test('null values as reset password data', async () => {
	const data = {
		resetvalue: null,
		language: null
	}

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Reset values missing")
})

test('faulty language info in reset password', async () => {
	const data = {
		resetvalue: 'sami',
		language: "hrewuherwiuhweriuhre"
	}

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Faulty language information")
})

test('null as set new password data', async () => {
	const data = null

	await api
		.post('/api/setnewpassword')
		.send(data)
		.expect("Required password data missing")
})

test('null values as set new password data', async () => {
	const data = {
		user: null,
		code: null,
		password: undefined,
		confirmPassword: undefined,
		language: null
	}

	await api
		.post('/api/setnewpassword')
		.send(data)
		.expect("Required password data missing")
})

test('faulty language info in set new password', async () => {
	const data = {
		user: 'testi',
		code: '@Y#!@U#HI#',
		password: '1234',
		confirmPassword: '1234',
		language: "hrewuherwiuhweriuhre"
	}

	await api
		.post('/api/setnewpassword')
		.send(data)
		.expect("Faulty language information")
})

test('not matching passwords in set new password', async () => {
	const data = {
		user: 'testi',
		code: 'JDWLLJWDQLJ',
		password: '1234Qx&&&1',
		confirmPassword: '1234Qx&&&',
		language: "en"
	}

	await api
		.post('/api/setnewpassword')
		.send(data)
		.expect("The entered passwords are not the same!")
})

test('faulty passwords in set new password', async () => {
	const data = {
		user: 'testi',
		code: 'JDWLLJWDQLJ',
		password: '1234Qx&&&1*(#*!@)(@!#*)_@(!#*)_!@#*)_!@#(*)_!@#*)(!*@#!#@*()_',
		confirmPassword: '1234Qx&&&1*(#*!@)(@!#*)_@(!#*)_!@#*)_!@#(*)_!@#*)(!*@#!#@*()_',
		language: "en"
	}

	await api
		.post('/api/setnewpassword')
		.send(data)
		.expect("PLEASE ENTER A PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character (a-z), at least one uppercase character (A-Z), at least one numeric character (0-9) and at least one special character.")
})

// requires database access

// test('too long code value in set new password', async () => {
// 	const data = {
// 		user: 'testi',
// 		code: 'JDWLLJWDQLJ#@@#(!*)*(#@!*DFHKJFSDHLKJFDSH*(@))(@!#*)(@#!)(@*#DWDKSALJDASLKJDSLAJLKADSJ:LKASJKLCSNKJNCSAJKNSKSAKDHJKSAFHJKFASHJKDSHKLDGHQWFGGWQIUHDWUHDWUIHWQDIUOHDIUWQHIUOWDQHIUODWQHIOUWDQHIUOWQDHIOUHWQDIUOHWQDIUOHWQDIOUHDWQIHQWDIOUq',
// 		password: '1234Qx&&&',
// 		confirmPassword: '1234Qx&&&',
// 		language: "en"
// 	}

// 	await api
// 		.post('/api/setnewpassword')
// 		.send(data)
// 		.expect("Password reset code not found!")
// })

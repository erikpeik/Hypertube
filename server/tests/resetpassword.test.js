const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('null as reset password data', async () => {
	const data = null

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Reset value missing")
})

test('null values', async () => {
	const data = {
		resetvalue: null,
		language: null
	}

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Reset value missing")
})

test('faulty language info', async () => {
	const data = {
		resetvalue: 'sami',
		language: "hrewuherwiuhweriuhre"
	}

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Faulty language information")
})


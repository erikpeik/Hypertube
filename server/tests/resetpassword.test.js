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

test('null as reset value', async () => {
	const data = {
		resetvalue: null
	}

	await api
		.post('/api/resetpassword')
		.send(data)
		.expect("Reset value missing")
})


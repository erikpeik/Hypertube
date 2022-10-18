const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/', (req, res) => {
	res.send('Welcome to Hypertube')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})

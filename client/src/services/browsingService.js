import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/browsing'

const getMovies = () => {
	const request = axios.get(`${baseUrl}/movies`)
	return request.then(response => response.data)
}

const browsingService = { getMovies }

export default browsingService

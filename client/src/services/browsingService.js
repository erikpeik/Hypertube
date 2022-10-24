import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/browsing'

const getMovies = () => {
	const request = axios.get(`${baseUrl}/movies`)
	return request.then(response => response.data)
}

const getMovieQuery = values => {
	if (values.query === "") {
		values.query = '0'
	}
	console.log('values', values)
	const request = axios.post(`${baseUrl}/movie_query`, values)
	return request.then(response => response.data)
}

const getIMDbData = imdb_id => {
	const request = axios.post(`${baseUrl}/imdb_data`, imdb_id)
	return request.then(response => response.data)
}

const browsingService = { getMovies, getIMDbData, getMovieQuery }

export default browsingService

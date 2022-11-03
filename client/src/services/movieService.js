import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/movie'


const getUserWatchMovie = (imdb_id, userId) => {
	const request = axios.post(`${baseUrl}/${imdb_id}`,{userId});
	return request.then((response) => response.data);
};

const movieService = { getUserWatchMovie }

export default movieService

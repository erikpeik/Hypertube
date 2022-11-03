import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/movies/watch';

const getUserWatchMovie = (imdb_id, userId) => {
	const request = axios.post(`${baseUrl}/${imdb_id}`, { userId });
	return request.then((response) => response.data);
};

const isWatched = (userId) => {
	const request = axios.post(`${baseUrl}`, { userId });
	return request.then((response) => response.data);
};

const movieService = { getUserWatchMovie, isWatched };

export default movieService;

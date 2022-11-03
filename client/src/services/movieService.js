import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/movies';

const getUserWatchMovie = async (imdb_id, userId) => {
	const request = axios.post(`${baseUrl}/watch/${imdb_id}`, { userId });
	return request.then((response) => response.data);
};

const isWatched = async (userId) => {
	const request = axios.post(`${baseUrl}/watch`, { userId });
	return request.then((response) => response.data);
};

const getMovieData = async (imdb_id) => {
	const request = axios.get(`${baseUrl}/${imdb_id}`);
	return request.then((response) => response.data);
};

const movieService = { getUserWatchMovie, isWatched, getMovieData };

export default movieService;

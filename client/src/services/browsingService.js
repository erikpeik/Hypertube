import axios from "axios";
const baseUrl = "http://localhost:3001/api/browsing";

const getMovies = async () => {
	const request = axios.get(`${baseUrl}/movies`);
	return request.then((response) => response.data);
};

const getMovieQuery = async (values) => {
	if (values.query === "") {
		values.query = "0";
	}
	const request = axios.post(`${baseUrl}/movie_query`, values);
	return request.then((response) => response);
};

const getSingleMovieQuery = imdb_id => {
	const request = axios.get(`${baseUrl}/movie_query/${imdb_id}`);
	return request.then((response) => response.data);
}

const getIMDbData = async (imdb_id) => {
	const request = axios.post(`${baseUrl}/imdb_data`, imdb_id);
	return request.then((response) => response.data);
};

const getRecommendedMovies = async (imdb_id) => {
	const request = axios.get(`${baseUrl}/recommended_movies/${imdb_id}`);
	return request.then((response) => response.data);
}

const checkImage = async (values) => {
	const request = axios.post(`${baseUrl}/check_image`, values );
	return request.then((response) => response.data);
}

const browsingService = { getMovies, getIMDbData, getMovieQuery, getSingleMovieQuery, getRecommendedMovies, checkImage };

export default browsingService;

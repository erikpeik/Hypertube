import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const baseUrl = 'http://localhost:3001/api/browsing/movie_query'

const useFetch = (query, page) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [movies, setMovies] = useState([]);

	if (query === "") {
		query = '0';
	}

	const sendQuery = useCallback(async () => {
		try {
			setLoading(true)
			setError(false)
			const res = await axios.post(`${baseUrl}`, { query, page })
			const newMovie = res.data.data.movies || []
			setMovies((prev) => [...prev, ...newMovie])
			setLoading(false)
		} catch (err) {
			setError(err)
		}
	}, [query, page]);

	useEffect(() => {
		sendQuery(query);
	}, [query, page, sendQuery]);

	return { loading, error, movies };
}

export default useFetch;

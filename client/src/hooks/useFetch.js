import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const baseUrl = 'http://localhost:3001/api/browsing/movie_query'

const useFetch = (query, page, genre, setPage) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [movies, setMovies] = useState([]);
	const [currentQuery, setCurrentQuery] = useState('');
	const [currentGenre, setCurrentGenre] = useState(null);

	if (query !== currentQuery) {
		setCurrentQuery(query);
		setMovies([]);
		setPage(1);
	}

	if (genre !== currentGenre) {
		setCurrentGenre(genre);
		setMovies([]);
		setPage(1);
	}

	const sendQuery = useCallback(async () => {
		try {
			setLoading(true)
			setError(false)
			const genre_value = genre?.value
			const res = await axios.post(`${baseUrl}`, { query, genre: genre_value, page })
			const newMovie = res.data || []
			if (page > 1) {
				newMovie.splice(0, 2)
			}
			setMovies((prev) => [...prev, ...newMovie])
			setLoading(false)
		} catch (err) {
			setError(err)
		}
	}, [query, genre, page]);

	useEffect(() => {
		sendQuery();
	}, [query, page, genre, sendQuery,]);

	return { loading, error, movies };
}

export default useFetch;

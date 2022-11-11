import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/browsing/movie_query';

const useFetch = (
	query,
	page,
	genre,
	sort_by,
	order_by,
	imdb_rating,
	setPage
) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [movies, setMovies] = useState([]);
	const [infinite_movies, setInfiniteMovies] = useState([]);

	const [currentQuery, setCurrentQuery] = useState('');
	const [currentGenre, setCurrentGenre] = useState(null);
	const [currentSortBy, setCurrentSortBy] = useState(null);
	const [currentOrderBy, setCurrentOrderBy] = useState(null);
	const [currentImdbRating, setCurrentImdbRating] = useState(null);

	if (query !== currentQuery) {
		setCurrentQuery(query);
		setMovies([]);
		setInfiniteMovies([]);
		setPage(1);
	}

	if (genre !== currentGenre) {
		setCurrentGenre(genre);
		setMovies([]);
		setInfiniteMovies([]);

		setPage(1);
	}

	if (sort_by !== currentSortBy) {
		setCurrentSortBy(sort_by);
		setMovies([]);
		setInfiniteMovies([]);

		setPage(1);
	}

	if (order_by !== currentOrderBy) {
		setCurrentOrderBy(order_by);
		setMovies([]);
		setInfiniteMovies([]);

		setPage(1);
	}

	if (imdb_rating !== currentImdbRating) {
		setCurrentImdbRating(imdb_rating);
		setMovies([]);
		setInfiniteMovies([]);

		setPage(1);
	}

	const sendQuery = useCallback(async () => {
		try {
			setLoading(true);
			setError(false);
			const values = {
				query,
				genre: genre?.value,
				sort_by: sort_by?.value,
				order_by,
				page,
				imdb_rating: imdb_rating?.value
			};
			const res = await axios.post(`${baseUrl}`, values);
			const newMovie = res.data || [];
			if (page > 1) {
				newMovie.splice(0, 2);
			}
			setMovies((prev) => [...prev, ...newMovie]);
			setInfiniteMovies((prev) => [...prev, ...newMovie]);

			setLoading(false);
		} catch (err) {
			setError(err);
		}
	}, [query, genre, page, imdb_rating, sort_by, order_by]);

	useEffect(() => {
		sendQuery();
	}, [query, page, genre, sendQuery]);

	return { loading, error, movies, infinite_movies };
};

export default useFetch;

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
	const [currentQuery, setCurrentQuery] = useState('');
	const [currentGenre, setCurrentGenre] = useState(null);
	const [currentSortBy, setCurrentSortBy] = useState(null);
	const [currentOrderBy, setCurrentOrderBy] = useState(null);
	const [currentImdbRating, setCurrentImdbRating] = useState(null);
	const profileData = useSelector((state) => state.profile);

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

	if (sort_by !== currentSortBy) {
		setCurrentSortBy(sort_by);
		setMovies([]);
		setPage(1);
	}

	if (order_by !== currentOrderBy) {
		setCurrentOrderBy(order_by);
		setMovies([]);
		setPage(1);
	}

	if (imdb_rating !== currentImdbRating) {
		setCurrentImdbRating(imdb_rating);
		setMovies([]);
		setPage(1);
	}

	const infinite_scroll = profileData?.infinite_scroll;

	const sendQuery = useCallback(async () => {
		try {
			if (infinite_scroll) {
				setLoading(true);
				setError(false);
				const values = {
					query,
					genre: genre?.value,
					sort_by: sort_by?.value,
					order_by,
					page,
					imdb_rating: imdb_rating?.value,
				};
				const res = await axios.post(`${baseUrl}`, values);
				const newMovie = res.data || [];
				if (page > 1) {
					newMovie.splice(0, 2);
				}
				if (infinite_scroll === 'YES') {
					setMovies((prev) => [...prev, ...newMovie]);
				} else {
					setMovies(newMovie);
				}
				setLoading(false);
			}
		} catch (err) {
			setError(err);
		}
	}, [query, genre, page, imdb_rating, sort_by, order_by, infinite_scroll]);

	useEffect(() => {
		sendQuery();
	}, [query, page, genre, sendQuery]);

	return { loading, error, movies };
};

export default useFetch;

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import browsingService from '../services/browsingService';

const useFetch = (query, genre, sort_by, order_by, imdb_rating) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [movies, setMovies] = useState([]);
	const profileData = useSelector((state) => state.profile);
	const page = useSelector((state) => state.page);
	const [currentValues, setCurrentValues] = useState({
		currentQuery: '',
		currentGenre: null,
		currentSortBy: null,
		currentOrderBy: 'desc',
		currentImdbRating: null,
	});

	let infinite_scroll = profileData?.infinite_scroll;

	if (
		query !== currentValues.currentQuery ||
		genre !== currentValues.currentGenre ||
		sort_by !== currentValues.currentSortBy ||
		order_by !== currentValues.currentOrderBy ||
		imdb_rating !== currentValues.currentImdbRating
	) {
		setMovies([]);
		setCurrentValues({
			currentQuery: query,
			currentGenre: genre,
			currentSortBy: sort_by,
			currentOrderBy: order_by,
			currentImdbRating: imdb_rating,
		});
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
				imdb_rating: imdb_rating?.value,
			};
			const res = await browsingService.getMovieQuery(values);
			if (!res.data.error) {
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

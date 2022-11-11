import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Typography, Button } from '@mui/material';
import '../css/style.css';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import SearchBar from './browsing/SearchBar';
import MovieList from './browsing/MovieList';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import movieService from '../services/movieService';

const Infinite = ({ movies, loading, error, loader, watched }) => {
	return (
		<>
			<MovieList movies={movies} watched={watched} />
			{loading && <LoaderDots />}
			{error && <Typography sx={{ color: 'white' }}>Error!</Typography>}
			<div ref={loader} />
		</>
	);
};

const Paginated = ({ movies, watched, page, setPage }) => {
	const plusOne = () => {
		setPage((prev) => prev + 1);
	};
	return (
		<>
			<MovieList movies={movies} watched={watched} />
			<Button onClick={plusOne}>Go next page!</Button>
		</>
	);
};

const Browsing = ({ t }) => {
	const [page, setPage] = useState(1);
	const [watched, setWatched] = useState([]);
	const loader = useRef();
	const profileData = useSelector((state) => state.profile);

	useEffect(() => {
		movieService.isWatched(profileData?.id).then((response) => {
			setWatched(response);
		});
	}, [profileData?.id, setWatched]);

	const [browsingSettings, setBrowsingSettings] = useState({
		submittedQuery: '',
		query: '',
		genre: null,
		sort_by: null,
		order_by: 'desc',
		imdb_rating: null,
	});

	const { submittedQuery, genre, sort_by, order_by, imdb_rating } =
		browsingSettings;

	const { loading, error, movies } = useFetch(
		submittedQuery,
		page,
		genre,
		sort_by,
		order_by,
		imdb_rating,
		setPage
	);

	const handleObserver = useCallback((entries) => {
		const target = entries[0];
		if (target.isIntersecting) {
			setPage((prev) => prev + 1);
		}
	}, []);

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '20px',
			threshold: 0,
		};
		const observer = new IntersectionObserver(handleObserver, options);
		if (loader.current) observer.observe(loader.current);
	}, [handleObserver]);

	if (!profileData) return <Loader />;

	return (
		<Container
			sx={{
				maxWidth: 1080,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<SearchBar
				t={t}
				browsingSettings={browsingSettings}
				setBrowsingSettings={setBrowsingSettings}
			/>
			{profileData?.infinite_scroll === 'YES' ? (
				<Infinite
					movies={movies}
					loading={loading}
					error={error}
					loader={loader}
					watched={watched}
				/>
			) : (
				<Paginated
					movies={movies}
					watched={watched}
					page={page}
					setPage={setPage}
				/>
			)}
		</Container>
	);
};

export default Browsing;

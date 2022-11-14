import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Typography, Button } from '@mui/material';
import '../css/style.css';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import SearchBar from './browsing/SearchBar';
import MovieList from './browsing/MovieList';
import { useSelector } from 'react-redux';
// import { useSearchParams } from 'react-router-dom';
import Loader from './Loader';
import movieService from '../services/movieService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import browsingService from '../services/browsingService';

const Infinite = ({ loader, watched, setPage, page, browsingSettings }) => {
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

	const handleObserver = useCallback(
		(entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				setPage((prev) => prev + 1);
			}
		},
		[setPage]
	);

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '20px',
			threshold: 0,
		};
		const observer = new IntersectionObserver(handleObserver, options);
		if (loader.current) observer.observe(loader.current);
	}, [handleObserver, loader]);

	return (
		<>
			<MovieList movies={movies} watched={watched} />
			{loading && <LoaderDots />}
			{error && <Typography sx={{ color: 'white' }}>Error!</Typography>}
			<div ref={loader} />
		</>
	);
};

const Paginated = ({ watched, page, setPage, browsingSettings }) => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const { submittedQuery, genre, sort_by, order_by, imdb_rating } =
		browsingSettings;

	const [currentSearch, setCurrentSearch] = useState({
		currentQuery: '',
		currentGenre: null,
		currentSortBy: null,
		currentOrderBy: 'desc',
		currentImdbRating: null,
	});

	const plusOne = () => {
		setPage(Number(page) + 1);
	};

	const minusOne = () => {
		if (page > 1) {
			setPage(Number(page) - 1);
		} else {
			setPage(1);
		}
	};

	useEffect(() => {
		const { currentQuery, currentGenre, currentSortBy, currentOrderBy } =
			currentSearch;
		if (
			currentQuery !== submittedQuery ||
			currentGenre !== genre ||
			currentSortBy !== sort_by ||
			currentOrderBy !== order_by
		) {
			setPage(1);
			setCurrentSearch({
				currentQuery: submittedQuery,
				currentGenre: genre,
				currentSortBy: sort_by,
				currentOrderBy: order_by,
				currentImdbRating: imdb_rating,
			});
		}
	}, [
		currentSearch,
		genre,
		imdb_rating,
		order_by,
		setPage,
		sort_by,
		submittedQuery,
	]);

	useEffect(() => {
		const values = {
			query: submittedQuery,
			genre: genre?.value,
			sort_by: sort_by?.value,
			order_by,
			page,
			imdb_rating: imdb_rating?.value,
		};

		browsingService.getMovieQuery(values).then((response) => {
			console.log(response);
			setLoading(false);
			if (page > 1 && response.data) {
				response.data.splice(0, 2);
			}
			setMovies(response.data || []);
			// console.log(response)
		});
	}, [page, submittedQuery, genre, sort_by, order_by, imdb_rating]);

	if (loading) return <Loader />;

	return (
		<>
			{movies.length < 20 ? (
				<MovieList movies={movies} watched={watched} />
			) : (
				<>
					<MovieList movies={movies} watched={watched} />
					<Grid sx={{ flexGrow: 1 }}>
						<Button onClick={minusOne}>
							<ArrowBackIcon />
							BACK
						</Button>
						<Button onClick={plusOne}>
							NEXT
							<ArrowForwardIcon />
						</Button>
					</Grid>
				</>
			)}
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

	if (!profileData || !page) return <Loader />;

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
					loader={loader}
					watched={watched}
					setPage={setPage}
					browsingSettings={browsingSettings}
					page={page}
				/>
			) : (
				<Paginated
					watched={watched}
					page={page}
					setPage={setPage}
					browsingSettings={browsingSettings}
				/>
			)}
		</Container>
	);
};

export default Browsing;

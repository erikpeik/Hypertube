import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Typography, Button } from '@mui/material';
import '../css/style.css';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import SearchBar from './browsing/SearchBar';
import MovieList from './browsing/MovieList';
import { useSelector, useDispatch } from 'react-redux';
import Loader from './Loader';
import movieService from '../services/movieService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import browsingService from '../services/browsingService';
import { setPage, increasePage } from '../reducers/pageReducer';

const Infinite = ({ loader, watched, browsingSettings }) => {
	const dispatch = useDispatch();
	const { submittedQuery, genre, sort_by, order_by, imdb_rating } =
		browsingSettings;

	const { loading, error, movies } = useFetch(
		submittedQuery,
		genre,
		sort_by,
		order_by,
		imdb_rating
	);

	const handleObserver = useCallback(
		(entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				dispatch(increasePage());
			}
		},
		[dispatch]
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

const Paginated = ({ watched, browsingSettings }) => {
	const dispatch = useDispatch();
	const page = useSelector((state) => state.page);
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
		dispatch(setPage(Number(page) + 1));
	};

	const minusOne = () => {
		if (page > 1) {
			dispatch(setPage(Number(page) - 1));
		} else {
			dispatch(setPage(1));
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
			dispatch(setPage(1));
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
		dispatch,
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

		setLoading(true);
		browsingService.getMovieQuery(values).then((response) => {
			setLoading(false);
			if (page > 1 && response.data) {
				response.data.splice(0, 2);
			}
			setMovies(response.data || []);
		});
	}, [page, submittedQuery, genre, sort_by, order_by, imdb_rating]);

	if (loading) return <Loader />;

	return (
		<>
			<MovieList movies={movies} watched={watched} />
			<Grid sx={{ flexGrow: 1, mb: 1 }}>
				{page > 1 && (
					<Button onClick={minusOne}>
						<ArrowBackIcon />
						BACK
					</Button>
				)}
				{movies.length >= 20 && (
					<Button onClick={plusOne}>
						NEXT
						<ArrowForwardIcon />
					</Button>
				)}
			</Grid>
		</>
	);
};

const Browsing = ({ t }) => {
	const [watched, setWatched] = useState([]);
	const loader = useRef();
	const profileData = useSelector((state) => state.profile);
	const page = useSelector((state) => state.page);

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
					browsingSettings={browsingSettings}
				/>
			) : (
				<Paginated
					watched={watched}
					browsingSettings={browsingSettings}
				/>
			)}
		</Container>
	);
};

export default Browsing;

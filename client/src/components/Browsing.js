import { useState, useEffect, useCallback, useRef } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	CardActionArea,
	Paper,
	Container,
	Grid,
} from '@mui/material';
import '../css/style.css';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import QuerySearch from './browsing/QuerySearch';
import AutoBrowsing from './browsing/AutoBrowsing';
import OrderBy from './browsing/OrderBy';

const Browsing = ({ t }) => {
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');
	const [genre, setGenre] = useState(null);
	const [sort_by, setSortBy] = useState(null);
	const [order_by, setOrderBy] = useState('desc');

	const [submittedQuery, setSubmittedQuery] = useState('');
	const { loading, error, movies } = useFetch(
		submittedQuery,
		page,
		genre,
		sort_by,
		order_by,
		setPage
	);
	const loader = useRef();
	const navigate = useNavigate();

	const handleQueryChange = (event) => {
		setQuery(event.target.value);
	};

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

	const submitMovieQuery = (event) => {
		event.preventDefault();
		const value = query.trim();
		console.log('value', value);
		setSubmittedQuery(value);
	};

	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`, {
			state: movies.filter((movie) => movie.imdb_code === movie_id),
		});
	};

	const genres = [
		{ label: t('categories.1'), value: 'Action' },
		{ label: t('categories.2'), value: 'Adventure' },
		{ label: t('categories.3'), value: 'Animation' },
		{ label: t('categories.4'), value: 'Biography' },
		{ label: t('categories.5'), value: 'Comedy' },
		{ label: t('categories.6'), value: 'Crime' },
		{ label: t('categories.7'), value: 'Documentary' },
		{ label: t('categories.8'), value: 'Drama' },
		{ label: t('categories.9'), value: 'Family' },
		{ label: t('categories.10'), value: 'Fantasy' },
		{ label: t('categories.11'), value: 'Film-Noir' },
		{ label: t('categories.12'), value: 'History' },
		{ label: t('categories.13'), value: 'Horror' },
		{ label: t('categories.14'), value: 'Music' },
		{ label: t('categories.15'), value: 'Musical' },
		{ label: t('categories.16'), value: 'Mystery' },
		{ label: t('categories.17'), value: 'Romance' },
		{ label: t('categories.18'), value: 'Sci-Fi' },
		{ label: t('categories.19'), value: 'Sport' },
		{ label: t('categories.20'), value: 'Thriller' },
		{ label: t('categories.21'), value: 'War' },
		{ label: t('categories.22'), value: 'Western' },
	];

	const sortList = [
		{ label: 'Title', value: 'title' },
		{ label: 'Rating', value: 'rating' },
		{ label: 'Year', value: 'year' },
		{ label: 'Seeds', value: 'seeds' },
		{ label: 'Date added', value: 'date_added' },
	];

	return (
		<Container
			sx={{
				maxWidth: 1080,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Paper
				sx={{
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-around',
					display: 'flex',
					width: '100%',
					maxWidth: 1030,
					height: '100%',
					margin: 1,
					padding: 1,
				}}
			>
				<Grid container spacing={2} display="flex">
					<Grid item xs={12} sm={3}>
						<QuerySearch
							t={t}
							query={query}
							handleQueryChange={handleQueryChange}
							submitMovieQuery={submitMovieQuery}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<AutoBrowsing
							value={genre}
							setValue={setGenre}
							id="genre-list"
							options={genres}
							label={t('browsing.6')}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<AutoBrowsing
							value={sort_by}
							setValue={setSortBy}
							id="sort-select"
							options={sortList}
							label={t('browsing.7')}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<OrderBy
							t={t}
							value={order_by}
							setValue={setOrderBy}
						/>
					</Grid>
				</Grid>
			</Paper>

			<Box
				container="true"
				spacing={3}
				style={{
					direction: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					display: 'flex',
					flexWrap: 'wrap',
					width: '100%',
					height: '100%',
				}}
			>
				{movies.map((movie, value) => (
					<Box
						sx={{
							margin: 1,
							marginBottom: 3,
							maxHeight: 345,
							maxWidth: 245,
						}}
						key={value}
						item="true"
						xs={3}
						onClick={() => navigateToMovie(movie.imdb_code)}
					>
						<Card className="container" sx={{ flexGrow: 1 }}>
							<CardActionArea>
								<CardContent
									style={{
										textOverflow: 'ellipsis',
									}}
									className="newsletter"
								>
									<Typography
										gutterBottom
										variant="h7"
										style={{
											whiteSpace: 'pre-line',
											overflowWrap: 'break-word',
											wordWrap: 'break-word',
											hyphens: 'auto',
											overflow: 'hidden',
										}}
									>
										{movie.title_long}
									</Typography>
									<Typography>
										IMDB rate: {movie.rating}
									</Typography>
									<Typography>
										Seeds: {movie.torrents[0].seeds}
									</Typography>
								</CardContent>
								<CardMedia
									sx={{
										borderRadius: 1,
										width: 245,
										height: 345,
									}}
									component="img"
									image={movie.medium_cover_image}
									alt={movie.title_long}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = require('../images/no_image.png');
									}}
								/>
							</CardActionArea>
						</Card>
					</Box>
				))}
			</Box>
			{loading && <LoaderDots />}
			{error && <p>Error!</p>}
			<div ref={loader} />
		</Container>
	);
};

export default Browsing;

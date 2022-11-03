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
import movieService from '../services/movieService';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Browsing = ({ t }) => {
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');
	const [genre, setGenre] = useState(null);
	const [sort_by, setSortBy] = useState(null);
	const [order_by, setOrderBy] = useState('desc');
	const [imdb_rating, setImdbRating] = useState(null);
	const [watched, setWatched] = useState(false);

	const [submittedQuery, setSubmittedQuery] = useState('');
	const { loading, error, movies } = useFetch(
		submittedQuery,
		page,
		genre,
		sort_by,
		order_by,
		imdb_rating,
		setPage
	);
	const loader = useRef();
	const navigate = useNavigate();
	const profileData = useSelector((state) => state.profile);

	useEffect(() => {
		if (profileData) {
			movieService.isWatched(profileData.id).then((response) => {
				setWatched(response);
			});
		}
	}, [profileData]);


	// const handleObserver = useCallback((entries) => {
	// 	const target = entries[0];
	// 	if (target.isIntersecting) {
	// 		setPage((prev) => prev + 1);
	// 	}
	// }, []);

	// useEffect(() => {
	// 	const options = {
	// 		root: null,
	// 		rootMargin: '20px',
	// 		threshold: 0,
	// 	};
	// 	const observer = new IntersectionObserver(handleObserver, options);
	// 	if (loader.current) observer.observe(loader.current);
	// }, [handleObserver]);


	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`, {
			state: movies.filter((movie) => movie.imdb_code === movie_id),
		});
	};

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
					<Grid item xs={12} sm={6}>
						<QuerySearch
							t={t}
							query={query}
							handleQueryChange={handleQueryChange}
							submitMovieQuery={submitMovieQuery}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<AutoBrowsing
							value={genre}
							setValue={setGenre}
							id="genre-list"
							options={genres}
							label={t('browsing.6')}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<AutoBrowsing
							value={sort_by}
							setValue={setSortBy}
							id="sort-select"
							options={sortList}
							label={t('browsing.7')}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<OrderBy t={t} value={order_by} setValue={setOrderBy} />
					</Grid>
					<Grid item xs={12} sm={4}>
						<AutoBrowsing
							value={imdb_rating}
							setValue={setImdbRating}
							id="imdb-rating"
							options={imdbRatingList}
							label={t('browsing.8')}
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
									{watched &&
									watched.includes(movie.imdb_code) ? (
										<Typography>
											<VisibilityIcon />
										</Typography>
									) : null}
									{/* <Typography>
										Seeds: {movie.torrents[0].seeds}
									</Typography> */}
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
		</Container>
	);
};

export default Browsing;

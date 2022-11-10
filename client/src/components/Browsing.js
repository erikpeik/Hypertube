import { useState, useEffect, useCallback, useRef } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	CardActionArea,
	Container,
} from '@mui/material';
import '../css/style.css';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import movieService from '../services/movieService';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchBar from './browsing/SearchBar';

const Browsing = ({ t }) => {
	const [page, setPage] = useState(1);
	const [watched, setWatched] = useState([]);
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
	const loader = useRef();
	const navigate = useNavigate();
	const profileData = useSelector((state) => state.profile);

	useEffect(
		() => console.log('browsingSettings', browsingSettings),
		[browsingSettings]
	);

	useEffect(() => {
		if (profileData) {
			movieService.isWatched(profileData.id).then((response) => {
				setWatched(response);
			});
		}
	}, [profileData, setWatched]);

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

	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`);
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
			<SearchBar
				t={t}
				browsingSettings={browsingSettings}
				setBrowsingSettings={setBrowsingSettings}
			/>
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

import '../css/movie.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Typography,
	Paper,
	Grid,
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
} from '@mui/material';
import { Container } from '@mui/system';
import Loader from './Loader';
import browsingService from '../services/browsingService';
import VideoPlayer from './VideoPlayer';
import Comments from './movie/Comments';
import PathNotExists from './PathNotExists';

const MoviePage = ({ t }) => {
	const [imdbData, setImdbData] = useState(null);
	const [show, setShow] = useState(false);
	const [recommendedMovies, setRecommendedMovies] = useState(null);
	const navigate = useNavigate();
	const params = useParams();
	const imdb_id = params.id;

	useEffect(() => {
		browsingService.getIMDbData({ imdb_id: imdb_id }).then((data) => {
			const imdbArray = [
				'Title',
				'Year',
				'Rated',
				'Released',
				'Runtime',
				'Genre',
				'Director',
				'Writer',
				'Actors',
				'Plot',
				'Language',
				'Country',
				'Awards',
				'Metascore',
				'imdbRating',
				'imdbVotes',
			];
			const ytsArray = [
				'description_full',
				'genres',
				'language',
				'rating',
				'runtime',
				'title',
				'year',
			];

			if (data.error) {
				setImdbData('error');
			} else {
				const asArray = Object.entries(data);
				const filtered = asArray.filter(
					([key, value]) =>
						(typeof value === 'string' ||
							typeof value === 'number') &&
						value !== 'N/A' &&
						(imdbArray.includes(key) || ytsArray.includes(key))
				);
				let backToNormal = Object.fromEntries(filtered);
				for (const [key, value] of Object.entries(backToNormal)) {
					if (key === 'description_full') {
						backToNormal['Plot'] = value;
						delete backToNormal['description_full'];
					}
					if (key === 'genres') {
						backToNormal['Genre'] = value;
						delete backToNormal['genres'];
					}
					if (key === 'language') {
						backToNormal['Language'] = value;
						delete backToNormal['language'];
					}
					if (key === 'rating') {
						backToNormal['imdbRating'] = value;
						delete backToNormal['rating'];
					}
					if (key === 'runtime') {
						backToNormal['Runtime'] = value;
						delete backToNormal['runtime'];
					}
					if (key === 'title') {
						backToNormal['Title'] = value;
						delete backToNormal['title'];
					}
					if (key === 'year') {
						backToNormal['Year'] = value;
						delete backToNormal['year'];
					}
				}
				setImdbData(backToNormal || '');
			}
		});

		browsingService.getRecommendedMovies(imdb_id).then((response) => {
			setRecommendedMovies(response?.data?.movies || []);
		});
	}, [imdb_id]);

	if (!imdbData || !recommendedMovies) return <Loader />;

	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`);
		window.location.reload();
	};

	if (imdbData === 'error') {
		return (
			<Box
				container="true"
				// spacing={3}
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
				<PathNotExists />
			</Box>
		);
	} else {
		return (
			<Box>
				<Box>
					<h2 className="movie-title">
						{imdbData.Title} ({imdbData.Year})
					</h2>
					<VideoPlayer imdb_id={imdb_id} t={t} />
					<h5 className="comment" onClick={() => setShow(!show)}>
						{t('movie.0')}{' '}
					</h5>
				</Box>
				{show && <Comments movieId={imdb_id} t={t} />}
				<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
					<Paper elevation={10} sx={{ padding: 3 }}>
						{Object.keys(imdbData).map((key) => (
							<Grid
								container
								key={`container${key + imdbData[key]}`}
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mb: 2,
								}}
							>
								<Typography
									sx={{
										width: 'fit-content',
										fontWeight: '700',
									}}
								>
									{`${key || ''}:`}
								</Typography>
								<Grid item xs={12} sm={10}>
									<Typography
										sx={{
											width: 'fit-content',
											wordBreak: 'break-all',
										}}
									>
										{imdbData[key]}
									</Typography>
								</Grid>
							</Grid>
						))}
					</Paper>
					<Paper sx={{ mt: 4 }}>
						<Typography
							sx={{ display: 'flex', justifyContent: 'center' }}
						>
							{t('movie.1')}
						</Typography>
						<Box
							container="true"
							spacing={3}
							style={{
								direction: 'column',
								alignItems: 'center',
								justifyContent: 'left',
								display: 'flex',
								width: '100%',
								height: '100%',
								overflowX: 'auto',
							}}
						>
							{recommendedMovies.map((movie, value) => (
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
									onClick={() =>
										navigateToMovie(movie.imdb_code)
									}
								>
									<Card
										className="container"
										sx={{ flexGrow: 1 }}
									>
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
														overflowWrap:
															'break-word',
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
					</Paper>
				</Container>
			</Box>
		);
	}
};

export default MoviePage;

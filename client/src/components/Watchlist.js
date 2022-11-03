import { useState, useEffect } from 'react';
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
import movieService from '../services/movieService';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const Browsing = ({ t }) => {
	const [watched, setWatched] = useState(false);
	const profileData = useSelector((state) => state.profile);

	useEffect(() => console.log(watched), [watched]);

	useEffect(() => {
		const getMoviesData = async (response) => {
			let movie_list = [];
			for (let i = 0; i < response.length; i++) {
				const movieData = await movieService.getMovieData(response[i]);
				console.log('movieData', movieData);
				movie_list.push(movieData);
				if (i === response.length - 1) setWatched(movie_list);
			}
		};

		if (profileData) {
			movieService.isWatched(profileData.id).then((response) => {
				getMoviesData(response);
			});
		}
	}, [profileData]);

	// const navigateToMovie = (movie_id) => {
	// 	console.log(movie_id);
	// };

	if (!watched) {
		return <Loader />;
	}

	return (
		<Container
			sx={{
				maxWidth: 1080,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
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
				{watched.map((movie, value) => {
					return (
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
					);
				})}
			</Box>
		</Container>
	);
};

export default Browsing;

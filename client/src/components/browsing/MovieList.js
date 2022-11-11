import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	CardActionArea,
} from '@mui/material';

const MovieList = ({ movies, watched }) => {
	const navigate = useNavigate();

	const navigateToMovie = (movie_id) => navigate(`/movie/${movie_id}`);

	return (
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
									e.target.src = require('../../images/no_image.png');
								}}
							/>
						</CardActionArea>
					</Card>
				</Box>
			))}
		</Box>
	);
};

export default MovieList;

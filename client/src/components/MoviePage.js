import "../css/movie.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Typography, Paper, Grid, Box, Card, CardActionArea, CardContent, CardMedia
} from "@mui/material";
import { Container } from "@mui/system";
import Loader from "./Loader";
import browsingService from "../services/browsingService";
import VideoPlayer from "./VideoPlayer";
import Comments from "./movie/Comments";
import PathNotExists from "./PathNotExists";

const MoviePage = ({ t }) => {
	const [imdbData, setImdbData] = useState(null);
	const [show, setShow] = useState(false);
	const [recommendedMovies, setRecommendedMovies] = useState(null);
	const params = useParams();
	const navigate = useNavigate();
	// const { loading } = useFetch();
	useEffect(() => {
		browsingService
			.getIMDbData({ imdb_id: params.id })
			.then((movieData) => {
				setImdbData(Object.entries(movieData) || "");
			});
		browsingService.getRecommendedMovies(params.id).then((response) => {
			setRecommendedMovies(response?.data?.movies || []);
		});
	}, [params]);

	if (!imdbData || !recommendedMovies) return <Loader />;

	const movieData = imdbData.filter((data, i) => {
		return i <= 12 || data[0] === "imdbRating" || data[0] === "imdbVotes";
	});


	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`);
		window.location.reload();
	};

	console.log("imdbData :", imdbData)
	console.log("recommendedMovies :", recommendedMovies)
	if (imdbData[0][1] === 'False') {
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
				<PathNotExists />
			</Box>
		)
	} else {
		return (
			<Box>
				<Box>
					<h2 className="movie-title">
						{movieData[0][1]} ({movieData[1][1]})
					</h2>
					<VideoPlayer
						imdb_id={params.id}
					/>
					<h5 className="comment" onClick={() => setShow(!show)}>
						{t("movie.0")}{" "}
					</h5>
				</Box>
				{show && <Comments movieId={params.id} t={t} />}
				<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
					<Paper elevation={10} sx={{ padding: 3 }}>
						{movieData.map((value, i) => (
							<Grid
								container
								key={`container${i}`}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									mb: 2,
								}}
							>
								<Typography
									sx={{ width: "fit-content", fontWeight: "700" }}
								>
									{`${value[0]}:`}
								</Typography>
								<Grid item xs={12} sm={10}>
									<Typography
										sx={{
											width: "fit-content",
											wordBreak: "break-all",
										}}
									>
										{value[1]}
									</Typography>
								</Grid>
							</Grid>
						))}
					</Paper>
					<Paper sx={{ mt: 4 }}>
						<Typography
							sx={{ display: "flex", justifyContent: "center" }}
						>
							{t("movie.1")}
						</Typography>
						<Box
							container="true"
							spacing={3}
							style={{
								direction: "column",
								alignItems: "center",
								justifyContent: "left",
								display: "flex",
								// flexWrap: "wrap",
								width: "100%",
								height: "100%",
								overflowX: "auto",
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
									onClick={() => navigateToMovie(movie.imdb_code)}
								>
									<Card
										className="container"
										sx={{ flexGrow: 1 }}
									>
										<CardActionArea>
											<CardContent
												style={{
													textOverflow: "ellipsis",
												}}
												className="newsletter"
											>
												<Typography
													gutterBottom
													variant="h7"
													style={{
														whiteSpace: "pre-line",
														overflowWrap: "break-word",
														wordWrap: "break-word",
														hyphens: "auto",
														overflow: "hidden",
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
													e.target.src = require("../images/no_image.png");
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

import browsingService from "../services/browsingService";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Input,
	Button,
	CardActionArea,
	Paper,
	Container,
} from "@mui/material";
import "../css/style.css";
import { useNavigate } from "react-router-dom";

const Browsing = () => {
	const [movies, setMovies] = useState(null);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const handleQueryChange = (event) => {
		setQuery(event.target.value);
	};

	useEffect(() => {
		browsingService.getMovieQuery({ query: "", page }).then((movies) => {
			console.log(movies.data);
			setMovies(movies.data.movies || []);
		});
	}, [page]);

	const submitMovieQuery = (event) => {
		event.preventDefault();
		const value = query.trim();

		browsingService.getMovieQuery({ query: value, page }).then((movies) => {
			console.log(movies.data.movies);
			setMovies(movies.data.movies || []);
		});
	};

	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`,{state: movies.filter(movie => movie.imdb_code === movie_id)});
	};

	if (!movies) return <Loader />;

	return (
		<Container sx={{ maxWidth: 1080, justifyContent: "center" }}>
			<Paper
				style={{
					direction: "column",
					alignItems: "center",
					justifyContent: "center",
					display: "flex",
					width: 400,
					height: "100%",
					margin: 10,
				}}
			>
				<Input
					type="text"
					placeholder="Search"
					value={query}
					onChange={handleQueryChange}
				/>
				<Button type="submit" onClick={submitMovieQuery}>
					Search
				</Button>
			</Paper>
			<Box
				container="true"
				spacing={3}
				style={{
					direction: "column",
					alignItems: "center",
					justifyContent: "center",
					display: "flex",
					flexWrap: "wrap",
					width: "100%",
					height: "100%",
				}}
			>
				{movies.map((movie) => (
					<Box
						sx={{
							margin: 1,
							marginBottom: 3,
							maxHeight: 345,
							maxWidth: 245,
						}}
						key={movie.id}
						item="true"
						xs={3}
						onClick={() => navigateToMovie(movie.imdb_code)}
					>
						<Card className="container" sx={{ flexGrow: 1 }}>
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

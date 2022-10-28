import { useState, useEffect, useCallback, useRef } from "react";
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
import useFetch from "../hooks/useFetch";
import LoaderDots from "./LoaderDots";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Browsing = (props) => {
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");

	const [name, setName] = useState([]);
	const [rate, setRate] = useState([]);
	const [year, setYear] = useState([]);
	const [seed, setSeed] = useState([]);

	const [submittedQuery, setSubmittedQuery] = useState("");
	const { loading, error, movies } = useFetch(
		submittedQuery,
		page,
		setPage,
		name,
		rate,
		year,
		seed
	);
	const loader = useRef();
	const navigate = useNavigate();

	const handleQueryChange = (event) => {
		setQuery(event.target.value);
	};

	console.log(movies);

	const handleSortClickByName = () => {
		// const strAscending = [...movies].sort((a, b) => {
		//   return a.title > b.title ? 1 : -1;
		// });
		// console.log(strAscending)
		let val = movies.sort(function (a, b) {
			let dateA = a.title.toLowerCase();
			let dateB = b.title.toLowerCase();
			if (dateA < dateB) {
				return -1;
			} else if (dateA > dateB) {
				return 1;
			}
			return 0;
		});
		setName(val);
	};

	const handleSortClickByRate = () => {
		let val = movies.sort(function (a, b) {
			return b.rating - a.rating;
		});
		setRate(val);
	};

	const handleSortClickByYear = () => {
		let val = movies.sort(function (a, b) {
			return b.year - a.year;
		});
		setYear(val);
	};

	const handleSortClickBySeed = () => {
		let val = movies.sort(function (a, b) {
			return b.torrents[0].seeds - a.torrents[0].seeds;
		});
		setSeed(val);
	};

	useEffect(() => {
		setName(null);
		setRate(null);
		setYear(null);
		setSeed(null);
	}, [name, rate, year, seed]);

	const handleObserver = useCallback((entries) => {
		const target = entries[0];
		if (target.isIntersecting) {
			setPage((prev) => prev + 1);
		}
	}, []);

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: "20px",
			threshold: 0,
		};
		const observer = new IntersectionObserver(handleObserver, options);
		if (loader.current) observer.observe(loader.current);
	}, [handleObserver]);

	const submitMovieQuery = (event) => {
		event.preventDefault();
		const value = query.trim();
		console.log("value", value);
		setSubmittedQuery(value);
	};

	const navigateToMovie = (movie_id) => {
		navigate(`/movie/${movie_id}`, {
			state: movies.filter((movie) => movie.imdb_code === movie_id),
		});
	};

	return (
		<Container
			sx={{ maxWidth: 1080, display: "flex", flexDirection: "column" }}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					mt: 1,
				}}
			>
				<Paper
					style={{
						direction: "column",
						alignItems: "center",
						justifyContent: "space-around",
						display: "flex",
						width: "100%",
						maxWidth: "730px",
						height: "100%",
						margin: 10,
						padding: 10,
					}}
				>
					<Box>
						<Input
							type="text"
							placeholder="Search"
							value={query}
							onChange={handleQueryChange}
						/>
						<Button type="submit" onClick={submitMovieQuery}>
							Search
						</Button>
					</Box>
					<FormControl
						sx={{ width: 125, maxWidth: 130 }}
						size="small"
					>
						<InputLabel id="demo-select-small">Age</InputLabel>
						<Select labelId="demo-select-small" label="Sort by">
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem
								value="Name"
								onClick={handleSortClickByName}
							>
								Name
							</MenuItem>
							<MenuItem
								value="Rate"
								onClick={handleSortClickByRate}
							>
								Rate
							</MenuItem>
							<MenuItem
								value="Year"
								onClick={handleSortClickByYear}
							>
								Year
							</MenuItem>
							<MenuItem
								value="Seed"
								onClick={handleSortClickBySeed}
							>
								Seed
							</MenuItem>
						</Select>
					</FormControl>
				</Paper>
			</Box>

			{/* <Button onClick={handleSortClickByName}>Sort by Name</Button>
			<Button id="rate" onClick={handleSortClickByRate}>
				Sort by Rate
			</Button>
			<Button id="date" onClick={handleSortClickByYear}>
				Sort by Release Year
			</Button>
			<Button id="seed" onClick={handleSortClickBySeed}>
				Sort by Seed
			</Button> */}

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
										e.target.src = require("../images/no_image.png");
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

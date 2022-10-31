import { useState, useEffect, useCallback, useRef } from "react";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Button,
	CardActionArea,
	Paper,
	Container,
	Autocomplete,
} from "@mui/material";
import "../css/style.css";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import LoaderDots from "./LoaderDots";

import { InputLabel, MenuItem, FormControl, Select, TextField } from "@mui/material";

const Browsing = (props) => {
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [genre, setGenre] = useState(null);

	const [name, setName] = useState([]);
	const [rate, setRate] = useState([]);
	const [year, setYear] = useState([]);
	const [seed, setSeed] = useState([]);

	const [horror, setHorror] = useState([]);

	const [submittedQuery, setSubmittedQuery] = useState("");
	const { loading, error, movies } = useFetch(
		submittedQuery,
		page,
		genre,
		setPage,
	);
	const loader = useRef();
	const navigate = useNavigate();

	const handleQueryChange = (event) => {
		setQuery(event.target.value);
	};

	// ========= UNDER Construction =========

	const handleSortClickByHorror = () => {
		let val = movies.sort((movie) => {
			let test = movie.genres.filter((genre) => genre === "Horror");
			console.log(test);
			if (test[0] === 'Horror') {
				return -1;
			} else {
				return test.splice(0, test[0]);
			}
		});
		setHorror(val);
	};

	// ========= UNDER Construction =========

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
		setHorror(null);
	}, [name, rate, year, seed, horror]);

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

	const genres = [
		{ label: "Action", value: "Action" },
		{ label: "Adventure", value: "Adventure" },
		{ label: "Animation", value: "Animation" },
		{ label: "Biography", value: "Biography" },
		{ label: "Comedy", value: "Comedy" },
		{ label: "Crime", value: "Crime" },
		{ label: "Documentary", value: "Documentary" },
		{ label: "Drama", value: "Drama" },
		{ label: "Family", value: "Family" },
		{ label: "Fantasy", value: "Fantasy" },
		{ label: "Film-Noir", value: "Film-Noir" },
		{ label: "History", value: "History" },
		{ label: "Horror", value: "Horror" },
		{ label: "Music", value: "Music" },
		{ label: "Musical", value: "Musical" },
		{ label: "Mystery", value: "Mystery" },
		{ label: "Romance", value: "Romance" },
		{ label: "Sci-Fi", value: "Sci-Fi" },
		{ label: "Sport", value: "Sport" },
		{ label: "Thriller", value: "Thriller" },
		{ label: "War", value: "War" },
		{ label: "Western", value: "Western" },
	]

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
						{/* <Input
							type="text"
							placeholder="Search"
							value={query}
							onChange={handleQueryChange}
							inputProps={{ maxLength: 40 }}
						/> */}
						<TextField
							size="small"
							type="text"
							label="Search"
							variant="outlined"
							value={query}
							onChange={handleQueryChange}
							inputProps={{ maxLength: 40 }}
						/>
						<Button
							sx={{ marginLeft: 1, marginTop: 0.2 }}
							variant="outlined"
							type="submit"
							onClick={submitMovieQuery}
						>
							Search
						</Button>
					</Box>

					<Autocomplete
						value={genre}
						onChange={(event, value) => {
							setGenre(value);
						}}
						id='genre-select'
						disablePortal
						sx={{ width: '50vw', maxWidth: 200 }}
						getOptionLabel={(option) => option.label}
						isOptionEqualToValue={(option, value) => option.label === value.label}
						options={genres}
						autoHighlight
						renderInput={(params) => (
							<TextField
								{...params}
								label="Categories"
							/>
						)}
					/>

					<FormControl
						sx={{ width: 125, maxWidth: 130 }}
						size="small"
					>
						<InputLabel id="demo-select-small">Sort by</InputLabel>
						<Select
							value={""}
							labelId="demo-select-small"
							label="Sort by"
						>
							<MenuItem
								value={"Name" || ""}
								onClick={handleSortClickByName}
							>
								Name
							</MenuItem>
							<MenuItem
								value={"Rate" || ""}
								onClick={handleSortClickByRate}
							>
								Rate
							</MenuItem>
							<MenuItem
								value={"Year" || ""}
								onClick={handleSortClickByYear}
							>
								Year
							</MenuItem>
							<MenuItem
								value={"Seed" || ""}
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

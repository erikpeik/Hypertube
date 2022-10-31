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

import {
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	TextField,
} from "@mui/material";

const Browsing = ({ t }) => {
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
		setPage
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
			if (test[0] === "Horror") {
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
		{ label: t("categories.1"), value: "Action" },
		{ label: t("categories.2"), value: "Adventure" },
		{ label: t("categories.3"), value: "Animation" },
		{ label: t("categories.4"), value: "Biography" },
		{ label: t("categories.5"), value: "Comedy" },
		{ label: t("categories.6"), value: "Crime" },
		{ label: t("categories.7"), value: "Documentary" },
		{ label: t("categories.8"), value: "Drama" },
		{ label: t("categories.9"), value: "Family" },
		{ label: t("categories.10"), value: "Fantasy" },
		{ label: t("categories.11"), value: "Film-Noir" },
		{ label: t("categories.12"), value: "History" },
		{ label: t("categories.13"), value: "Horror" },
		{ label: t("categories.14"), value: "Music" },
		{ label: t("categories.15"), value: "Musical" },
		{ label: t("categories.16"), value: "Mystery" },
		{ label: t("categories.17"), value: "Romance" },
		{ label: t("categories.18"), value: "Sci-Fi" },
		{ label: t("categories.19"), value: "Sport" },
		{ label: t("categories.20"), value: "Thriller" },
		{ label: t("categories.21"), value: "War" },
		{ label: t("categories.22"), value: "Western" },
	];

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
							label={t("browsing.1")}
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
							{t("browsing.1")}
						</Button>
					</Box>

					<Autocomplete
						value={genre}
						onChange={(event, value) => {
							setGenre(value);
						}}
						id="genre-select"
						disablePortal
						sx={{ width: "50vw", maxWidth: 200 }}
						getOptionLabel={(option) => option.label}
						isOptionEqualToValue={(option, value) =>
							option.label === value.label
						}
						options={genres}
						autoHighlight
						renderInput={(params) => (
							<TextField {...params} label={t("browsing.6")} />
						)}
					/>

					<FormControl
						sx={{ width: 125, maxWidth: 130 }}
						size="small"
					>
						<InputLabel id="demo-select-small">
							{t("browsing.7")}
						</InputLabel>
						<Select
							value={""}
							labelId="demo-select-small"
							label="Sort by"
						>
							<MenuItem
								value={`${t("browsing.2")}` || ""}
								onClick={handleSortClickByName}
							>
								{t("browsing.2")}
							</MenuItem>
							<MenuItem
								value={`${t("browsing.3")}` || ""}
								onClick={handleSortClickByRate}
							>
								{t("browsing.3")}
							</MenuItem>
							<MenuItem
								value={`${t("browsing.4")}` || ""}
								onClick={handleSortClickByYear}
							>
								{t("browsing.4")}
							</MenuItem>
							<MenuItem
								value={`${t("browsing.5")}` || ""}
								onClick={handleSortClickBySeed}
							>
								{t("browsing.5")}
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

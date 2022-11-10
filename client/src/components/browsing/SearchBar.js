import QuerySearch from './QuerySearch';
import AutoBrowsing from './AutoBrowsing';
import OrderBy from './OrderBy';
import { Grid, Paper } from '@mui/material';

const SearchBar = ({ t, browsingSettings, setBrowsingSettings }) => {
	const genres = [
		{ label: t('categories.1'), value: 'Action' },
		{ label: t('categories.2'), value: 'Adventure' },
		{ label: t('categories.3'), value: 'Animation' },
		{ label: t('categories.4'), value: 'Biography' },
		{ label: t('categories.5'), value: 'Comedy' },
		{ label: t('categories.6'), value: 'Crime' },
		{ label: t('categories.7'), value: 'Documentary' },
		{ label: t('categories.8'), value: 'Drama' },
		{ label: t('categories.9'), value: 'Family' },
		{ label: t('categories.10'), value: 'Fantasy' },
		{ label: t('categories.11'), value: 'Film-Noir' },
		{ label: t('categories.12'), value: 'History' },
		{ label: t('categories.13'), value: 'Horror' },
		{ label: t('categories.14'), value: 'Music' },
		{ label: t('categories.15'), value: 'Musical' },
		{ label: t('categories.16'), value: 'Mystery' },
		{ label: t('categories.17'), value: 'Romance' },
		{ label: t('categories.18'), value: 'Sci-Fi' },
		{ label: t('categories.19'), value: 'Sport' },
		{ label: t('categories.20'), value: 'Thriller' },
		{ label: t('categories.21'), value: 'War' },
		{ label: t('categories.22'), value: 'Western' },
	];

	const sortList = [
		{ label: t('browsing.2'), value: 'title' },
		{ label: t('browsing.3'), value: 'rating' },
		{ label: t('browsing.4'), value: 'year' },
		{ label: t('browsing.9'), value: 'date_added' },
	];

	const imdbRatingList = [
		{ label: 'All', value: null },
		{ label: '9+', value: 9 },
		{ label: '8+', value: 8 },
		{ label: '7+', value: 7 },
		{ label: '6+', value: 6 },
		{ label: '5+', value: 5 },
		{ label: '4+', value: 4 },
		{ label: '3+', value: 3 },
		{ label: '2+', value: 2 },
		{ label: '1+', value: 1 },
	];

	const { query, genre, sort_by, order_by, imdb_rating } = browsingSettings;

	const handleQueryChange = (event) => {
		setBrowsingSettings({ ...browsingSettings, query: event.target.value });
	};

	const submitMovieQuery = (event) => {
		event.preventDefault();
		const value = query.trim();
		setBrowsingSettings({ ...browsingSettings, submittedQuery: value });
	};

	const setGenre = (event) => {
		setBrowsingSettings({
			...browsingSettings,
			genre: event,
			submittedQuery: query,
		});
	};

	const setSortBy = (event) => {
		setBrowsingSettings({
			...browsingSettings,
			sort_by: event,
			submittedQuery: query,
		});
	};

	const setOrderBy = (event) => {
		setBrowsingSettings({
			...browsingSettings,
			order_by: event,
			submittedQuery: query,
		});
	};

	const setImdbRating = (event) => {
		setBrowsingSettings({
			...browsingSettings,
			imdb_rating: event,
			submittedQuery: query,
		});
	};

	return (
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
	);
};

export default SearchBar;

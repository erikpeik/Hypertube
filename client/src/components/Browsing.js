import { useState, useEffect, useCallback, useRef } from 'react';
import { Container } from '@mui/material';
import '../css/style.css';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import SearchBar from './browsing/SearchBar';
import MovieList from './browsing/MovieList';
import { useSelector, useDispatch } from 'react-redux';
import Loader from './Loader';
import Infinite from './infinite';
import Pagination from './Pagination';

const Browsing = ({ t }) => {
	const profileData = useSelector((state) => state.profile);
	console.log(profileData);
	const [page, setPage] = useState(1);
	const loader = useRef();

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

	// const [data, setData] = useState([]);
	// const [load, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [recordsPerPage] = useState(10);

	const { loading, error, movies, infinite_movies } = useFetch(
		submittedQuery,
		currentPage,
		genre,
		sort_by,
		order_by,
		imdb_rating,
		setCurrentPage
	);

	if (!movies || profileData === null) return <Loader />;

	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = infinite_movies.slice(
		indexOfFirstRecord,
		indexOfLastRecord
	);
	const nPages = Math.ceil(infinite_movies.length / recordsPerPage);
	console.log(profileData.infinite_scroll);
	// if (profileData.infinite_scroll === 'NO') {
	// 	return (
	// 		<Container
	// 			sx={{
	// 				maxWidth: 1080,
	// 				display: 'flex',
	// 				flexDirection: 'column',
	// 				alignItems: 'center',
	// 			}}
	// 		>
	// 			<SearchBar
	// 				t={t}
	// 				browsingSettings={browsingSettings}
	// 				setBrowsingSettings={setBrowsingSettings}
	// 			/>
	// 			<MovieList movies={currentRecords} />
	// 			<Pagination
	// 				nPages={nPages}
	// 				currentPage={currentPage}
	// 				setCurrentPage={setCurrentPage}
	// 			/>
	// 			{loading && <LoaderDots />}
	// 			{error && <p>Error!</p>}
	// 			<div ref={loader} />
	// 		</Container>
	// 	);
	// }
	// if (profileData.infinite_scroll === 'YES') {
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
			<MovieList movies={movies} />
			{loading && <LoaderDots />}
			{error && <p>Error!</p>}
			<div ref={loader} />
		</Container>
	);
	// }
};

export default Browsing;

import { useState, useEffect, useCallback, useRef } from 'react';
import { Container } from '@mui/material';
import '../css/style.css';
import useFetch from '../hooks/useFetch';
import LoaderDots from './LoaderDots';
import SearchBar from './browsing/SearchBar';
import MovieList from './browsing/MovieList';

import Pagination from './Pagination';

const Browsing = ({ t }) => {
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

	const [data, setData] = useState([]);
	const [load, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [recordsPerPage] = useState(10);

	const { loading, error, movies } = useFetch(
		submittedQuery,
		currentPage,
		genre,
		sort_by,
		order_by,
		imdb_rating,
		setCurrentPage,
	);

<<<<<<< HEAD
	// useEffect(() => {
	//     axios.get('MOCK_DATA.json')
	//         .then(res => {
	//                 setData(res.data);
	//                 setLoading(false);
	//             })
	//             .catch(() => {
	//                 alert('There was an error while retrieving the data')
	//             })
	// }, [])

	useEffect(
		() => console.log('browsingSettings', browsingSettings),
		[browsingSettings]
	);

	// const handleObserver = useCallback((entries) => {
	// 	const target = entries[0];
	// 	if (target.isIntersecting) {
	// 		setPage((prev) => prev + 1);
	// 	}
	// }, []);
=======
	const handleObserver = useCallback((entries) => {
		const target = entries[0];
		if (target.isIntersecting) {
			setPage((prev) => prev + 1);
		}
	}, []);
>>>>>>> 81c6df0a53d061d3ad89ad4159e5d05b32626355

	// useEffect(() => {
	// 	const options = {
	// 		root: null,
	// 		rootMargin: '20px',
	// 		threshold: 0,
	// 	};
	// 	const observer = new IntersectionObserver(handleObserver, options);
	// 	if (loader.current) observer.observe(loader.current);
	// }, [handleObserver]);

	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = movies.slice(indexOfFirstRecord, indexOfLastRecord);
	const nPages = Math.ceil(movies.length / recordsPerPage);

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
			<MovieList movies={currentRecords} />
			<Pagination
				nPages={nPages}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			{loading && <LoaderDots />}
			{error && <p>Error!</p>}
			<div ref={loader} />
		</Container>
	);
};

export default Browsing;

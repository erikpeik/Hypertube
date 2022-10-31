import SearchIcon from '@mui/icons-material/Search';
import { InputBase, Paper, IconButton } from '@mui/material';

const QuerySearch = ({ t, query, handleQueryChange, submitMovieQuery }) => {
	return (
		<Paper
			elevation={0}
			sx={{
				p: '2px 4px',
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				height: '56px',
				border: '1px solid #C4C4C4',
				'&:hover': {
					border: '1px solid #000000',
				},
			}}
		>
			<InputBase
				value={query}
				onChange={handleQueryChange}
				sx={{ ml: 1, flex: 1 }}
				placeholder={t('browsing.1')}
				inputProps={{ 'aria-label': 'search movies' }}
				onKeyPress={(event) => {
					if (event.key === 'Enter') {
						submitMovieQuery(event);
					}
				}}
			/>
			<IconButton
				type="button"
				sx={{ p: '10px' }}
				aria-label="search"
				onClick={submitMovieQuery}
			>
				<SearchIcon />
			</IconButton>
		</Paper>
	);
};

export default QuerySearch;

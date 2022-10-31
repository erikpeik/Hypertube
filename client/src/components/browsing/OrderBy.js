import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const OrderBy = ({ t, value, setValue }) => {
	return (
		<FormControl sx={{ width: '100%' }}>
			<InputLabel id="asc-desc">Order by</InputLabel>
			<Select
				labelId="asc-desc"
				id="asc-desc-select"
				value={value}
				sx={{ width: '100%' }}
				label="Order by"
				onChange={(event) => {
					setValue(event.target.value);
				}}
			>
				<MenuItem value={'asc'}>Ascending</MenuItem>
				<MenuItem value={'desc'}>Descending</MenuItem>
			</Select>
		</FormControl>
	);
};

export default OrderBy;

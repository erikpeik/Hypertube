import { Autocomplete, TextField } from '@mui/material';

const AutoBrowsing = ({value, setValue, id, options, label}) => {
	return (
		<Autocomplete
			value={value}
			onChange={(event, value) => {
				setValue(value);
			}}
			id={id}
			disablePortal
			sx={{ width: '100%' }}
			getOptionLabel={(option) => option.label}
			isOptionEqualToValue={(option, value) =>
				option.value === value.value
			}
			options={options}
			autoHighlight
			renderInput={(params) => <TextField {...params} label={label} />}
		/>
	);
};

export default AutoBrowsing;

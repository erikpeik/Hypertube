import { createSlice } from '@reduxjs/toolkit';

const severitySlice = createSlice({
	name: 'language',
	initialState: 'en',
	reducers: {
		setLanguage(state, action) {
			const content = action.payload;
			return content;
		},
	},
});

export const { setLanguage } = severitySlice.actions;
export default severitySlice.reducer;

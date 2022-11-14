import { createSlice } from '@reduxjs/toolkit';

const severitySlice = createSlice({
	name: 'page',
	initialState: 1,
	reducers: {
		setPage(state, action) {
			const content = action.payload;
			return content || 1;
		},
		increasePage(state, action) {
			return state + 1;
		}
	},
});

export const { setPage, increasePage } = severitySlice.actions;
export default severitySlice.reducer;

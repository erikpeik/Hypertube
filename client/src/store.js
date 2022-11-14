import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import notificationReducer from './reducers/notificationReducer';
import profileReducer from './reducers/profileReducer';
import severityReducer from './reducers/severityReducer';
import languageReducer from './reducers/languageReducer';
import pageReducer from './reducers/pageReducer';

const store = configureStore({
	reducer: {
		user: userReducer,
		profile: profileReducer,
		notification: notificationReducer,
		severity: severityReducer,
		language: languageReducer,
		page: pageReducer,
	},
});

export default store;

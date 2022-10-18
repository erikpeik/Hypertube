import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'
import profileReducer from './reducers/profileReducer'
import severityReducer from './reducers/severityReducer'

const store = configureStore({
	reducer: {
		user: userReducer,
		profile: profileReducer,
		notification: notificationReducer,
		severity: severityReducer
	}
})

export default store

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
	BrowserRouter as Router, Routes, Route
} from 'react-router-dom'
import signUpService from './services/signUpService'
import { setUser } from './reducers/userReducer'
import { getProfileData } from './reducers/profileReducer'
import Login from './components/Login'
import Logout from './components/Logout'
import Signup from './components/Signup'
import Profile from './components/Profile'
import NavBar from './components/Navbar'
import PathNotExists from './components/PathNotExists'
import ConfirmMail from './components/login/ConfirmMail'
import RedirectPage from './components/RedirectPage'
import ResetPassword, { SetNewPassword } from './components/login/ResetPassword'
import ChangePassword from './components/profile/ChangePassword'

const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getProfileData())
		signUpService
			.getSessionUser()
			.then(result => {
				dispatch(setUser(result))
			})
	}, [dispatch])

	return (
		<Router>
			<RedirectPage />
			<NavBar />
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/confirm/:user/:code" element={<ConfirmMail />} />
				<Route path="/login/resetpassword" element={<ResetPassword />} />
				<Route path="/resetpassword/:user/:code" element={<SetNewPassword />} />
				<Route path="/changepassword" element={<ChangePassword />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/logout" element={<Logout />} />
				<Route path='*' element={<PathNotExists />} />
			</Routes>
		</Router>
	)
}

export default App

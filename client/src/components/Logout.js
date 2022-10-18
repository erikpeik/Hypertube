import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../reducers/userReducer'
import { changeNotification } from '../reducers/notificationReducer'
import { changeSeverity } from '../reducers/severityReducer'
import signUpService from '../services/signUpService'
import { resetProfileData } from '../reducers/profileReducer'

const Logout = ( ) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const notification = useSelector((state => state.notification))

	useEffect(() => {
		signUpService.logOutUser()
		dispatch(setUser(""))
		dispatch(resetProfileData())
		dispatch(changeSeverity('success'))
		if (notification !== "User has been successfully deleted. Bye bye!")
			dispatch(changeNotification("Logged out. Thank you for using Matcha!"))
		// socket.emit("logOut", { socketID: socket.id })
		navigate('/login')
	}, [dispatch, navigate, notification])
}

export default Logout

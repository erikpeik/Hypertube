import { useState, useEffect } from 'react'
import { changeNotification, resetNotification } from '../../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
	Typography, Button, Paper, TextField, createTheme
} from '@mui/material'
import { Container } from '@mui/system'
// import { IconUserCircle } from '@tabler/icons'
import Notification from '../Notification'
import { changeSeverity } from '../../reducers/severityReducer'
import profileService from '../../services/profileService'
import Loader from '../Loader'

const ProfileSettings = () => {
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const profileData = useSelector(state => state.profile)
	const [settings, changeSettings] = useState({})

	useEffect(() => {
		dispatch(resetNotification())
		if (profileData) {
			changeSettings({
				username: profileData.username,
				firstname: profileData.firstname,
				lastname: profileData.lastname,
				email: profileData.email
			})
			setLoading(false)
		}
	}, [dispatch, profileData])

	if (isLoading) {
		return <Loader />
	}

	const theme = createTheme({
		palette: {
			primary: {
				main: '#000000',
			},
			secondary: {
				main: '#F5F5F5',
			},
		}
	})

	const submitSettings = (event) => {
		event.preventDefault()

		profileService.editUserSettings(settings).then((result) => {
			if (result === true) {
				dispatch(changeSeverity('success'))
				dispatch(changeNotification("Profile Settings Updated"))
				navigate('/profile')
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		})
	}

	// const imageStyle = {
	// 	display: 'relative',
	// 	marginLeft: 'calc(50% + 5px)',
	// 	transform: 'translate(-50%)',
	// 	filter: 'drop-shadow(0px 0px 3px rgb(241 25 38 / 0.8))',
	// }

	const handleUsername = (event) => {
		changeSettings({ ...settings, username: event.target.value })
	}

	const handleFirstname = (event) => {
		changeSettings({ ...settings, firstname: event.target.value })
	}

	const handleLastname = (event) => {
		changeSettings({ ...settings, lastname: event.target.value })
	}

	const handleEmail = (event) => {
		changeSettings({ ...settings, email: event.target.value })
	}

	return (
		<Container maxWidth='md' sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				{/* <IconUserCircle size={100} color="#F11926" style={imageStyle} /> */}
				<Typography variant='h5' align='center'
					sx={{ fontWeight: 550 }}>Profile</Typography>
				<Typography align='center' xs={{ mb: 4 }}>
					Here you can edit your profile settings
				</Typography>
				<form onSubmit={submitSettings}>
					<TextField fullWidth margin='normal' name="username" label='Username'
						placeholder="Username" value={settings.username} onChange={handleUsername} required></TextField>
					<TextField sx={{ width: '49%', mr: '1%' }} margin='dense' name="firstname"
						label='First name' placeholder="First name" value={settings.firstname} onChange={handleFirstname} required></TextField>
					<TextField sx={{ width: '49%', ml: '1%' }} margin='dense' name="lastname"
						label='Last name' placeholder="Last name" value={settings.lastname} onChange={handleLastname} required></TextField>
					<TextField type="email" fullWidth margin='dense' name="email" label='E-mail' autoComplete="email"
						placeholder="E-mail" value={settings.email} onChange={handleEmail} required />
					<Button type="submit" variant='contained' theme={theme}
						size='large' sx={{ mt: 1 }}>
						Save settings
					</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	)

}

export default ProfileSettings
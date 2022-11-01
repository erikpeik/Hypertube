import { useState, useEffect } from 'react';
import {
	changeNotification,
	resetNotification,
} from '../../reducers/notificationReducer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	Typography,
	Button,
	Paper,
	TextField,
	createTheme,
	Box,
} from '@mui/material';
import { Container } from '@mui/system';
// import { IconUserCircle } from '@tabler/icons'
import Notification from '../Notification';
import { changeSeverity } from '../../reducers/severityReducer';
import profileService from '../../services/profileService';
import Loader from '../Loader';
import { MenuItem, Select } from '@mui/material';

const ProfileSettings = ({ t }) => {
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profileData = useSelector((state) => state.profile);
	const [settings, changeSettings] = useState({});

	useEffect(() => {
		dispatch(resetNotification());
		if (profileData) {
			changeSettings({
				username: profileData.username,
				firstname: profileData.firstname,
				lastname: profileData.lastname,
				email: profileData.email,
			});
			setLoading(false);
		}
	}, [dispatch, profileData]);

	if (isLoading) {
		return <Loader />;
	}

	const theme = createTheme({
		palette: {
			primary: {
				main: '#000000',
			},
			secondary: {
				main: '#F5F5F5',
			},
		},
	});

	const submitSettings = (event) => {
		event.preventDefault();

		profileService.editUserSettings(settings).then((result) => {
			if (result === true) {
				dispatch(changeSeverity('success'));
				dispatch(changeNotification(`${t('profile_settings.1')}`));
				navigate('/profile');
			} else {
				dispatch(changeSeverity('error'));
				dispatch(changeNotification(result));
			}
		});
	};

	// const imageStyle = {
	// 	display: 'relative',
	// 	marginLeft: 'calc(50% + 5px)',
	// 	transform: 'translate(-50%)',
	// 	filter: 'drop-shadow(0px 0px 3px rgb(241 25 38 / 0.8))',
	// }

	const handleUsername = (event) => {
		changeSettings({ ...settings, username: event.target.value });
	};

	const handleFirstname = (event) => {
		changeSettings({ ...settings, firstname: event.target.value });
	};

	const handleLastname = (event) => {
		changeSettings({ ...settings, lastname: event.target.value });
	};

	const handleEmail = (event) => {
		changeSettings({ ...settings, email: event.target.value });
	};

	const handleLanguage = (event) => {
		changeSettings({ ...settings, language: event.target.value });
	};

	return (
		<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				{/* <IconUserCircle size={100} color="#F11926" style={imageStyle} /> */}
				<Typography
					variant="h5"
					align="center"
					sx={{ fontWeight: 550 }}
				>
					{t('profile_settings.0')}
				</Typography>
				<Typography align="center" xs={{ mb: 4 }}>
					{t('profile_settings.2')}
				</Typography>
				<form onSubmit={submitSettings}>
					<Box sx={{ textAlign: 'center' }}>
						<Typography>
							Change your language
						</Typography>
						<Select
							labelId="asc-desc"
							id="asc-desc-select"
							value={settings.language || ''}
							sx={{ width: '50%', marginLeft: '25%', marginRight: '25%' }}
							onChange={handleLanguage}
						>
							<MenuItem value={'English'}>🇬🇧 English</MenuItem>
							<MenuItem value={'Finnish'}>🇫🇮 Finnish</MenuItem>
							<MenuItem value={'Romanian'}>🇷🇴 Romanian</MenuItem>
							<MenuItem value={'Hungarian'}>🇭🇺 Hungarian</MenuItem>
						</Select>
					</Box>
					<TextField
						fullWidth
						margin="normal"
						name="username"
						label={t('profile_settings.3')}
						placeholder={t('profile_settings.3')}
						value={settings.username}
						onChange={handleUsername}
						required
					></TextField>
					<TextField
						sx={{ width: '49%', mr: '1%' }}
						margin="dense"
						name="firstname"
						label={t('profile_settings.4')}
						placeholder={t('profile_settings.4')}
						value={settings.firstname}
						onChange={handleFirstname}
						required
					></TextField>
					<TextField
						sx={{ width: '49%', ml: '1%' }}
						margin="dense"
						name="lastname"
						label={t('profile_settings.5')}
						placeholder={t('profile_settings.5')}
						value={settings.lastname}
						onChange={handleLastname}
						required
					></TextField>
					<TextField
						type="email"
						fullWidth
						margin="dense"
						name="email"
						label="E-mail"
						autoComplete="email"
						placeholder={t('profile_settings.6')}
						value={settings.email}
						onChange={handleEmail}
						required
					/>
					<Button
						type="submit"
						variant="contained"
						theme={theme}
						size="large"
						sx={{ mt: 1 }}
					>
						{t('profile_settings.7')}
					</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	);
};

export default ProfileSettings;

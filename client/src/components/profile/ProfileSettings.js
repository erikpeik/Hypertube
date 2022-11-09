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
	Switch,
	FormGroup,
	FormControlLabel,
} from '@mui/material';
import { Container } from '@mui/system';
import Notification from '../Notification';
import { changeSeverity } from '../../reducers/severityReducer';
import profileService from '../../services/profileService';
import Loader from '../Loader';
import { MenuItem, Select } from '@mui/material';
import { setLanguage } from '../../reducers/languageReducer';

const ProfileSettings = ({ t, i18n }) => {
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
				language: profileData.language,
				infiniteScroll: profileData.infinite_scroll,
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
		const language = event.target.value;
		const languages = ['en', 'fi', 'ro', 'hu'];
		if (languages.includes(language)) {
			i18n.changeLanguage(language);
			dispatch(setLanguage(language));
			changeSettings({ ...settings, language: language });
		}
	};

	const handleInfiniteScroll = (event) => {
		let value;
		event.target.checked === true ? (value = 'YES') : (value = 'NO');
		changeSettings({ ...settings, infiniteScroll: value });
	};

	return (
		<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
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
				<Box sx={{ textAlign: 'center', mt: 2 }}>
					<Typography>{t('profile_settings.15')}</Typography>
					<Select
						labelId="asc-desc"
						id="asc-desc-select"
						value={settings.language || ''}
						sx={{
							width: '50%',
							marginLeft: '25%',
							marginRight: '25%',
						}}
						onChange={handleLanguage}
					>
						<MenuItem value={'en'}>🇬🇧 {t('profile_settings.19')}</MenuItem>
						<MenuItem value={'fi'}>🇫🇮 {t('profile_settings.20')}</MenuItem>
						<MenuItem value={'ro'}>🇷🇴 {t('profile_settings.21')}</MenuItem>
						<MenuItem value={'hu'}>🇭🇺 {t('profile_settings.22')}</MenuItem>
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
					label={t('profile_settings.6')}
					autoComplete="email"
					placeholder={t('profile_settings.6')}
					value={settings.email}
					onChange={handleEmail}
					required
				/>
				<Box
					sx={{
						width: 'fit-content',
						margin: 'auto',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						mt: 2,
						mb: 1,
					}}
				>
					<Typography variant="body1" color="initial">
						{t('profile_settings.16')}
					</Typography>
					<FormGroup>
						<FormControlLabel
							control={<Switch />}
							label={
								settings.infiniteScroll === 'YES'
									? t('profile_settings.17')
									: t('profile_settings.18')
							}
							onChange={handleInfiniteScroll}
							checked={settings.infiniteScroll === 'YES'}
						/>
					</FormGroup>
				</Box>
				<Button
					type="submit"
					variant="contained"
					theme={theme}
					size="large"
					sx={{ mt: 1 }}
					onClick={submitSettings}
				>
					{t('profile_settings.7')}
				</Button>
				<Notification />
			</Paper>
		</Container>
	);
};

export default ProfileSettings;

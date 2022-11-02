import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeNotification } from '../../reducers/notificationReducer';
import { changeSeverity } from '../../reducers/severityReducer';
import Notification from '../Notification';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import profileService from '../../services/profileService';

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

const ChangePassword = ({ t }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector((state) => state.user);
	const language = useSelector((state) => state.language);

	useEffect(() => {
		if (user === undefined || user === '') {
			navigate('/login');
		}
	}, [user, navigate]);

	const submitPasswords = async (event) => {
		event.preventDefault();

		const passWords = {
			oldPassword: event.target.old_password.value,
			newPassword: event.target.new_password.value,
			confirmPassword: event.target.confirm_password.value,
			language: language,
		};

		profileService.changePassword(passWords).then((result) => {
			if (result === true) {
				dispatch(changeSeverity('success'));
				dispatch(changeNotification(`${t('profile_settings.8')}`));
				navigate('/profile');
			} else {
				dispatch(changeSeverity('error'));
				dispatch(changeNotification(result));
			}
		});
	};

	return (
		<Container maxWidth="sm" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Typography
					variant="h5"
					align="center"
					sx={{ fontWeight: 550 }}
				>
					{t('profile_settings.9')}
				</Typography>
				<Typography align="center">
					{t('profile_settings.14')}
				</Typography>
				<form onSubmit={submitPasswords}>
					<TextField
						type="password"
						fullWidth
						margin="dense"
						name="old_password"
						label={t('profile_settings.10')}
						placeholder={t('profile_settings.10')}
						required
					></TextField>
					<TextField
						type="password"
						fullWidth
						margin="dense"
						name="new_password"
						label={t('profile_settings.11')}
						placeholder={t('profile_settings.11')}
						required
					></TextField>
					<TextField
						type="password"
						fullWidth
						margin="dense"
						name="confirm_password"
						label={t('profile_settings.12')}
						placeholder={t('profile_settings.12')}
						required
					></TextField>
					<Button
						type="submit"
						variant="contained"
						theme={theme}
						size="large"
						sx={{ mt: 1 }}
					>
						{t('profile_settings.13')}
					</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	);
};

export default ChangePassword;

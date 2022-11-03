import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../reducers/notificationReducer';
import { useParams, useNavigate } from 'react-router-dom';
import signUpService from '../../services/signUpService';
import { Container, Paper, TextField, Typography, Button } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// import { IconMailForward } from '@tabler/icons'
import Notification from '../Notification';
import { changeNotification } from '../../reducers/notificationReducer';
import { changeSeverity } from '../../reducers/severityReducer';

// const imageStyle = {
// 	width: '100px',
// 	display: 'relative',
// 	marginLeft: 'calc(50% + 5px)',
// 	transform: 'translate(-50%)',
// 	filter: 'drop-shadow(0px 0px 3px rgb(241 25 38 / 0.8))',
// }

const theme = createTheme({
	palette: {
		primary: {
			main: '#fcba03',
		},
		secondary: {
			main: '#F5F5F5',
		},
	},
});

export const SetNewPassword = ({ t }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();
	const language = useSelector((state) => state.language);

	const sendNewPassword = async (event) => {
		event.preventDefault();

		const passwords = {
			user: params.user,
			code: params.code,
			password: event.target.password.value,
			confirmPassword: event.target.confirm_password.value,
			language: language,
		};

		signUpService.setNewPassword(passwords).then((result) => {
			if (result === true) {
				dispatch(changeSeverity('success'));
				dispatch(changeNotification(`${t('reset.1')}`));
				navigate('/login');
			} else {
				dispatch(changeSeverity('error'));
				dispatch(changeNotification(result));
			}
		});
	};

	return (
		<>
			<Container maxWidth="sm" sx={{ pt: 5, pb: 5 }}>
				<Paper elevation={10} sx={{ padding: 3 }}>
					<Typography
						variant="h5"
						align="center"
						sx={{ fontWeight: 550 }}
					>
						{t('reset.2')}
					</Typography>
					<Typography align="center">{t('reset.3')}</Typography>
					<form onSubmit={sendNewPassword}>
						<TextField
							type="password"
							fullWidth
							margin="dense"
							name="password"
							label={t('reset.4')}
							placeholder={t('reset.4')}
							required
						></TextField>
						<TextField
							type="password"
							fullWidth
							margin="dense"
							name="confirm_password"
							label={t('reset.5')}
							placeholder={t('reset.5')}
							required
						></TextField>
						<Button
							type="submit"
							variant="contained"
							theme={theme}
							size="large"
							sx={{ mt: 1 }}
						>
							{t('reset.6')}
						</Button>
					</form>
					<Notification />
				</Paper>
			</Container>
		</>
	);
};

const ResetPasswordForm = ({ t }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const language = useSelector((state) => state.language);

	const sendPasswordMail = (event) => {
		event.preventDefault();

		const resetInfo = {
			resetvalue: event.target.reset.value,
			language: language,
		};

		signUpService.resetPassword(resetInfo).then((result) => {
			const message = `${t('reset.10')}`;

			if (result === true) {
				dispatch(setNotification(message, 10));
				navigate('/login');
			} else {
				dispatch(setNotification(message, 10));
			}
		});
	};

	return (
		<Container maxWidth="sm" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ p: 3 }}>
				{/* <IconMailForward size={100} color="#F11926" style={imageStyle} /> */}
				<Typography
					variant="h5"
					align="center"
					sx={{ frontWeight: 550 }}
				>
					{t('reset.7')}
				</Typography>
				<Typography align="center">{t('reset.8')}</Typography>
				<form onSubmit={sendPasswordMail}>
					<TextField
						fullWidth
						margin="normal"
						name="reset"
						size="30"
						placeholder={t('reset.9')}
						label={t('reset.9')}
						autoComplete="email"
						required
					/>
					<Button
						type="submit"
						variant="contained"
						theme={theme}
						size="large"
						sx={{ mt: 1 }}
					>
						{t('reset.7')}
					</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	);
};

export default ResetPasswordForm;

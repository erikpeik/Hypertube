import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	Typography,
	Button,
	Paper,
	createTheme,
	Box,
	Grid,
	Avatar,
} from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { Container } from '@mui/system';
import Notification from './Notification';
import { getProfileData } from '../reducers/profileReducer';
import { changeSeverity } from '../reducers/severityReducer';
import { changeNotification } from '../reducers/notificationReducer';
import profileService from '../services/profileService';
import Loader from './Loader';

const theme = createTheme({
	palette: {
		primary: {
			main: '#6A5ACD',
		},
	},
});

const deleteTheme = createTheme({
	palette: {
		primary: {
			main: '#483D8B',
		},
	},
});

const Profile = ({ t }) => {
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profileData = useSelector((state) => state.profile);
	const language = useSelector((state) => state.language);

	useEffect(() => {
		const getData = async () => {
			await dispatch(getProfileData());
			setLoading(false);
		};
		getData();
	}, [dispatch]);

	if (isLoading || !profileData.id) {
		return <Loader text="Getting profile data..." />;
	}

	const profile_pic = profileData.profile_pic['picture_data'];

	const profilePictureStyle = {
		width: '100%',
		aspectRatio: '1/1',
		borderRadius: '50%',
		objectFit: 'cover',
	};

	const deleteUser = () => {
		if (window.confirm(`${t('del.1')}`)) {
			if (window.confirm(`${t('del.2')}`)) {
				if (window.confirm(`${t('del.3')}`)) {
					navigate('/deleteuser');
				}
			}
		}
	};
	const setProfilePicture = async (event) => {
		const image = event.target.files[0];
		if (image.size > 5242880) {
			dispatch(changeSeverity('error'));
			dispatch(changeNotification(`${t('profile.0')}`));
		} else {
			let formData = new FormData();
			formData.append('file', image);
			const result = await profileService.setProfilePic(
				formData,
				language
			);
			if (result === true) {
				dispatch(getProfileData());
				dispatch(changeSeverity('success'));
				dispatch(changeNotification(`${t('profile.8')}`));
			} else {
				dispatch(changeSeverity('error'));
				dispatch(changeNotification(result));
			}
		}
		event.target.value = '';
	};

	return (
		<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Grid
					sx={{
						display: 'flex',
						alignContent: 'center',
						alignItems: 'center',
						justifyContent: 'center',
						mb: 2,
					}}
				>
					<Box sx={{ width: '200px', display: 'inline-block' }}>
						<AspectRatio ratio={1}>
							<Avatar
								src={profile_pic}
								alt="profile"
								style={profilePictureStyle}
							/>
						</AspectRatio>
					</Box>
					<Box sx={{ width: 'fit-content', ml: 5 }}>
						<Typography variant="h2" sx={{ fontSize: '250%' }}>
							{profileData.username}
						</Typography>
					</Box>
				</Grid>
				<Container
					sx={{
						pb: '5',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<h4 style={{ color: "#6A5ACD"}}>{t('profile.1')}</h4>
					<Typography>{profileData.firstname}</Typography>
					<br />
					<h4 style={{ color: "#6A5ACD"}}>{t('profile.2')}</h4>
					<Typography>{profileData.lastname}</Typography>
					<br />
					<h4 style={{ color: "#6A5ACD"}}>{t('profile.3')}</h4>
					<Typography>{profileData.email}</Typography>
					<br />
				</Container>
				<Container
					sx={{ display: 'flex', justifyContent: 'space-between' }}
				>
					<Button
						theme={theme}
						onClick={() => navigate('/watchlist')}
					>
						{t('profile.10')}
					</Button>
					<Button theme={theme} onClick={() => navigate('/settings')}>
						{t('profile.4')}
					</Button>
					<Button theme={theme}>
						<label
							htmlFor="set_profilepic"
							className="styled-image-upload"
						>
							{t('profile.5')}
						</label>
						<input
							type="file"
							name="file"
							id="set_profilepic"
							accept="image/jpeg, image/png, image/jpg"
							onChange={setProfilePicture}
						></input>
					</Button>
					<Button
						theme={theme}
						onClick={() => navigate('/changepassword')}
					>
						{t('profile.6')}
					</Button>
				</Container>
				<br />
				<Container sx={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						theme={deleteTheme}
						variant="contained"
						onClick={() => deleteUser()}
					>
						{t('profile.7')}
					</Button>
				</Container>
			</Paper>
			<Notification />
		</Container>
	);
};

export default Profile;

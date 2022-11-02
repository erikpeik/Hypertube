import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Grid, Avatar } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { Container } from '@mui/system';
import Notification from './Notification';
// import { getProfileData } from '../reducers/profileReducer';
// import { changeSeverity } from '../reducers/severityReducer';
// import { changeNotification } from '../reducers/notificationReducer';
import profileService from '../services/profileService';
import Loader from './Loader';

const Profile = ({ t }) => {
	// const [isLoading, setLoading] = useState(true);
	// const dispatch = useDispatch();
	// const navigate = useNavigate();
	// const profileData = useSelector((state) => state.profile);
	const [profileId, setProfileId] = useState('');

	const id = window.location.pathname.slice(
		window.location.pathname.lastIndexOf('/') + 1,
		window.location.pathname.length
	);

	useEffect(() => {
		profileService.getUserProfile(id).then((response) => {
			setProfileId(response || '');
			console.log(response)
		});
	}, [id]);

	console.log('=======');
	console.log(profileId);
	console.log('=======');

	// useEffect(() => {
	// 	const getData = async () => {
	// 		await dispatch(getProfileData());
	// 		setLoading(false);
	// 	};
	// 	getData();
	// }, [dispatch]);

	// if (isLoading || !profileData.id) {
	// 	return <Loader text="Getting profile data..." />;
	// }

	// const profile_pic = profileData.profile_pic['picture_data'];

	const profilePictureStyle = {
		width: '100%',
		aspectRatio: '1/1',
		borderRadius: '50%',
		objectFit: 'cover',
	};

	return (
		<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
			{/* {profileId.map((profile, value) => { */}
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
								src={profileId.picture_data}
								alt="profile"
								style={profilePictureStyle}
							/>
							</AspectRatio>
						</Box>
						<Box sx={{ width: 'fit-content', ml: 5 }}>
							<Typography variant="h2" sx={{ fontSize: '250%' }}>
								{profileId.username}
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
						<h4>{t('profile.1')}</h4>
					<Typography>{profileId.firstname}</Typography>
					<h4>{t('profile.2')}</h4>
					<Typography>{profileId.lastname}</Typography>
					<h4>{t('profile.3')}</h4>
					<Typography>{profileId.email}</Typography>
					</Container>
				</Paper>;
			{/* })} */}

			<Notification />
		</Container>
	);
};

export default Profile;

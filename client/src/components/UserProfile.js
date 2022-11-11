import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Box, Grid, Avatar } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { Container } from '@mui/system';
import Notification from './Notification';
import profileService from '../services/profileService';
import PathNotExistsfrom from './PathNotExists';
import Loader from './Loader';

const Profile = ({ t }) => {
	const [profileId, setProfileId] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const params = useParams();
	const id = params.id;

	useEffect(() => {
		profileService.getUserProfile(id).then((response) => {
			if (response.id) {
				setProfileId(response || '');
			} else {
				setProfileId(null);
			}
			setIsLoading(false);
		});
	}, [id]);

	const profilePictureStyle = {
		width: '100%',
		aspectRatio: '1/1',
		borderRadius: '50%',
		objectFit: 'cover',
	};

	if (isLoading) return(<Loader />);

	if (profileId) {
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
					</Container>
				</Paper>
				<Notification />
			</Container>
		);
	} else {
		return <PathNotExistsfrom />;
	}
};

export default Profile;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	Typography,
	Button,
	Paper,
	createTheme,
	Box,
	Grid,
	Avatar
} from "@mui/material";
import AspectRatio from '@mui/joy/AspectRatio'
import { Container } from "@mui/system";
import Notification from "./Notification";
import { getProfileData } from "../reducers/profileReducer";
import { changeSeverity } from '../reducers/severityReducer'
import { changeNotification } from '../reducers/notificationReducer'
import profileService from '../services/profileService'
import Loader from "./Loader";

const theme = createTheme({
	palette: {
		primary: {
			main: "#FF1E56",
		},
	},
});

const deleteTheme = createTheme({
	palette: {
		primary: {
			main: "#FF0000",
		},
	},
});

const ProfileInput = ({ text, input }) => {
	return (
		<Grid item xs={12} sm={6} sx={{ display: "inline" }}>
			<Typography
				sx={{ width: 170, display: "inline-block", fontWeight: "700" }}
			>
				{text}
			</Typography>
			<Typography sx={{ width: "fit-content", display: "inline" }}>
				{input}
			</Typography>
		</Grid>
	);
};

const Profile = () => {
	const [isLoading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profileData = useSelector((state) => state.profile);

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

	const profile_pic = profileData.profile_pic['picture_data']
	console.log(profile_pic)

	const profilePictureStyle = {
		width: '100%',
		aspectRatio: '1/1',
		borderRadius: '50%',
		objectFit: 'cover',
	}

	const ProfileData = {
		"First name:": profileData.firstname,
		"Last name:": profileData.lastname,
		"Email address:": profileData.email,
	};

	const deleteUser = () => {
		if (
			window.confirm(
				"Are you sure you want to completely delete your account?"
			)
		) {
			if (window.confirm("Are you really, REALLY sure?")) {
				if (window.confirm("Are you 100% sure?")) {
					navigate("/deleteuser");
				}
			}
		}
	};

	const setProfilePicture = async (event) => {
		const image = event.target.files[0]
		if (image.size > 5242880) {
			dispatch(changeSeverity('error'))
			dispatch(changeNotification("The maximum size for uploaded images is 5 megabytes."))

		} else {
			let formData = new FormData()
			formData.append('file', image)
			const result = await profileService.setProfilePic(formData)
			if (result === true) {
				dispatch(getProfileData())
				dispatch(changeSeverity('success'))
				dispatch(changeNotification("Profile picture set!"))
			} else {
				dispatch(changeSeverity('error'))
				dispatch(changeNotification(result))
			}
		}
		event.target.value = ''
	}

	return (
		<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Grid
					sx={{
						display: "flex",
						alignContent: "center",
						alignItems: "center",
						justifyContent: "center",
						mb: 2,
					}}
				>
					<Box sx={{ width: '200px', display: 'inline-block' }}>
						<AspectRatio ratio={1}>
							<Avatar
								src={profile_pic}
								alt='profile'
								style={profilePictureStyle}
							/>
						</AspectRatio>
					</Box>
					<Box sx={{ width: "fit-content", ml: 5 }}>
						<Typography variant="h2" sx={{ fontSize: "250%" }}>
							{profileData.username}
						</Typography>
					</Box>
				</Grid>
				<Grid container spacing={1} direction="row" sx={{ mb: 2 }}>
					{Object.keys(ProfileData).map((key, index) => {
						return (
							<ProfileInput
								key={index}
								text={key}
								input={ProfileData[key]}
							/>
						);
					})}
				</Grid>
				<Button theme={theme} onClick={() => navigate("/settings")}>
					Edit profile
				</Button>
				<Button theme={theme}>
					<label htmlFor="set_profilepic" className="styled-image-upload">
						Set profile picture
					</label>
					<input type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture}></input>
				</Button>
				<Button
					theme={theme}
					onClick={() => navigate("/changepassword")}
				>
					Change password
				</Button>
				<Button
					theme={deleteTheme}
					variant="contained"
					onClick={() => deleteUser()}
				>
					Delete user
				</Button>
			</Paper>
			<Notification />
		</Container>
	);
};

export default Profile;

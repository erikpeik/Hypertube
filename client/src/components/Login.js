import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import signUpService from "../services/signUpService";
import { setUser } from "../reducers/userReducer";
import { changeNotification } from "../reducers/notificationReducer";
import { changeSeverity } from "../reducers/severityReducer";
import { getProfileData } from "../reducers/profileReducer";
import { Typography, Button, Paper, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import Notification from "./Notification";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const submitUser = async (event) => {
		event.preventDefault();

		const signedUpUser = {
			username: event.target.username.value,
			password: event.target.password.value,
		};

		signUpService.logInUser(signedUpUser).then((result) => {
			if (result.userid) {
				const sessionUser = {
					name: result.username,
					id: result.userid,
				};
				dispatch(setUser(sessionUser));
				dispatch(getProfileData());
				dispatch(changeNotification(""));
			} else {
				dispatch(changeSeverity("error"));
				dispatch(changeNotification(result));
			}
		});
	};

	const navigateToReset = () => {
		navigate("/login/resetpassword");
	};

	const theme = createTheme({
		palette: {
			primary: {
				main: "#000000",
			},
			secondary: {
				main: "#F5F5F5",
			},
		},
	});

	return (
		<Container maxWidth="sm" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Typography
					variant="h5"
					align="center"
					sx={{ fontWeight: 550 }}
				>
					Login
				</Typography>
				<Typography align="center" xs={{ mb: 4 }}>
					Login and start chillin' now!
				</Typography>
				<form onSubmit={submitUser}>
					<TextField
						fullWidth
						margin="normal"
						name="username"
						label="Username or e-mail address"
						placeholder="Username or email address"
						required
					></TextField>
					<TextField
						fullWidth
						margin="dense"
						type="password"
						name="password"
						label="Password"
						placeholder="Password"
						required
					></TextField>
					<Button
						type="submit"
						variant="contained"
						theme={theme}
						size="large"
						sx={{ mt: 1 }}
					>
						Submit
					</Button>
				</form>
				<a href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`}>
				<img
					alt='githublogo'
					src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
					width="50"
				></img>
				</a>
				<br></br>
				<Button onClick={navigateToReset} sx={{ mt: 1 }}>
					Forgot password?
				</Button>
				<Notification />
			</Paper>
		</Container>
	);
};

export default Login;

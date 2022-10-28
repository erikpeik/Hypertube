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

const Login = ({ t }) => {
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
				main: "#fcba03",
			},
			secondary: {
				main: "#F5F5F5",
			},
		},
	});

	let redirect_url = "http://localhost:3001/api/oauth/42direct";

	return (
		<Container maxWidth="sm" sx={{ display: "grid", pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Typography
					variant="h5"
					align="center"
					sx={{ fontWeight: 550 }}
				>
					{t("login.1")}
				</Typography>
				<Typography align="center" xs={{ mb: 4 }}>
					{t("login.2")}
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
						{t("login.3")}
					</Button>
				</form>
				<Container
					maxWidth="md"
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						pt: 1,
						pb: 1,
					}}
				>
					<a
						href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`}
					>
						<img
							alt="githublogo"
							src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
							width="50"
						></img>
					</a>
					<a
						href={`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_FORTYTWO_CLIENT_ID}&redirect_uri=${redirect_url}&response_type=code&scope=public`}
					>
						<img
							alt="42logo"
							src="https://api.intra.42.fr/assets/42_logo_api.svg"
							width="50"
							// onClick = {() => signUpService.connectWith42()}
						></img>
					</a>
					<br></br>
				</Container>
				<Button onClick={navigateToReset} sx={{ mt: 1 }}>
					{t("login.4")}
				</Button>
				<Notification />
			</Paper>
		</Container>
	);
};

export default Login;

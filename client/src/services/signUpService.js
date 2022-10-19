import axios from "axios";
const baseUrl = "http://localhost:3001/api";
axios.defaults.withCredentials = true;

const createUser = (signedUpUser) => {
	const request = axios.post(`${baseUrl}/signup`, signedUpUser);
	return request.then((response) => response.data);
};

const verifyUser = (userToVerify) => {
	const request = axios.post(`${baseUrl}/signup/verifyuser`, userToVerify);
	return request.then((response) => response.data);
};

const logInUser = (signedUpUser) => {
	const request = axios.post(`${baseUrl}/login`, signedUpUser);
	return request.then((response) => response.data);
};

const getSessionUser = () => {
	const request = axios.get(`${baseUrl}/login`);
	return request.then((response) => response.data);
};

const logOutUser = () => {
	const request = axios.post(`${baseUrl}/logout`);
	return request.then((response) => response.data);
};

const resetPassword = (resetInfo) => {
	const request = axios.post(`${baseUrl}/resetpassword`, resetInfo);
	return request.then((response) => response.data);
};

const setNewPassword = (passwords) => {
	const request = axios.post(`${baseUrl}/setnewpassword`, passwords);
	return request.then((response) => response.data);
};

const checkGithubConnection = token => {
	const request = axios.post(`${baseUrl}/oauth/githubconnect`, token);
	return request.then((response) => response);
}

const signUpService = {
	createUser,
	verifyUser,
	logInUser,
	logOutUser,
	getSessionUser,
	resetPassword,
	setNewPassword,
	checkGithubConnection
};

export default signUpService;

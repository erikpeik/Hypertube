import axios from "axios";
const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api`;
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

const setProfilePic = (Picture, user, language) => {
	const request = axios.post(`${baseUrl}/signup/setprofilepic/${user}/${language}`, Picture);
	return request.then((response) => response.data);
};

const connectWith42 = () => {
	axios.get(`${baseUrl}/oauth/42connect`);
}

const signUpService = {
	createUser,
	verifyUser,
	logInUser,
	logOutUser,
	getSessionUser,
	resetPassword,
	setNewPassword,
	setProfilePic,
	connectWith42
};

export default signUpService;

import axios from 'axios';
const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/profile`;

const editUserSettings = (ProfileSettings) => {
	const request = axios.post(`${baseUrl}/editsettings`, ProfileSettings);
	return request.then((response) => response.data);
};

const changePassword = (passWords) => {
	const request = axios.post(`${baseUrl}/changepassword`, passWords);
	return request.then((response) => response.data);
};

const getUserProfile = (userId) => {
	const request = axios.get(`${baseUrl}/${userId}`);
	return request.then((response) => response.data);
};

const getProfileData = () => {
	const request = axios.get(`${baseUrl}`);
	return request.then((response) => response.data);
};

const setProfilePic = (Picture, language) => {
	const request = axios.post(`${baseUrl}/setprofilepic/${language}`, Picture);
	return request.then((response) => response.data);
};

const uploadPicture = (Picture) => {
	const request = axios.post(`${baseUrl}/imageupload`, Picture);
	return request.then((response) => response.data);
};

const deletePicture = (PictureId) => {
	const request = axios.delete(`${baseUrl}/deletepicture/${PictureId}`);
	return request.then((response) => response.data);
};

const deleteUser = () => {
	const request = axios.delete(`${baseUrl}/deleteuser`);
	return request.then((response) => response.data);
};

const profileService = {
	getProfileData,
	setProfilePic,
	uploadPicture,
	deletePicture,
	editUserSettings,
	changePassword,
	deleteUser,
	getUserProfile,
};

export default profileService;

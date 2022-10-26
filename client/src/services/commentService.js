import axios from "axios";
const baseUrl = "http://localhost:3001/api";

const addComment = (comment) => {
	const request = axios.post(`${baseUrl}/newcomment`, comment);
	return request.then((response) => response.data);
};

const getComments = (movieId) => {
	const request = axios.get(`${baseUrl}/getcomments/${movieId}`);
	return request.then((response) => response.data);
};

const commentService = {
	addComment,
	getComments,
};

export default commentService;
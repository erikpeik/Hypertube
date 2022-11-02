import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeNotification } from "../../reducers/notificationReducer";
import { changeSeverity } from "../../reducers/severityReducer";
import Box from "@mui/material/Box";
import { Button, Paper, TextField } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import commentService from "../../services/commentService";
import { current } from "@reduxjs/toolkit";
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

const NewComment = ({ movieId, setRefresh, t }) => {

	const myRef = useRef('');
	const [newComment, setNewComment] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector((state) => state.user);
	useEffect(() => {
		if (user === undefined && user === "") {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		commentService.addComment(newComment, movieId).then((result) => {
			if (result === true) {
				setNewComment(null)
				dispatch(changeSeverity("success"));
				dispatch(changeNotification(`${t("movie.3")}`));
				setRefresh(Math.random(1, 1000));
			} else {
				dispatch(changeSeverity("error"));
				dispatch(changeNotification(result));
			}
		});
		myRef.current.value = '';	};
	return (
		<>
			<Box>
				<form onSubmit={handleSubmit}>
					<Paper style={{ padding: "20px 20px", marginTop: 10 }}>
						<TextField
							fullWidth
							onChange={(e) => {
								setNewComment(e.target.value);
							}}
							inputRef={myRef}
							autoFocus={true}
							margin="normal"
							name="comment"
							label={t("movie.4")}
							placeholder="comment"
							autoComplete="comment"
							required
						/>
					</Paper>
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
			</Box>
		</>
	);
};

export default NewComment;

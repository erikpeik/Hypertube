import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeNotification } from "../../reducers/notificationReducer";
import { changeSeverity } from "../../reducers/severityReducer";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { Button, Paper, TextField } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import commentService from "../../services/commentService";
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

const NewComment = () => {
	const [newComment, setNewComment] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector((state) => state.user);

	console.log("here", user);
	useEffect(() => {
		if (user === undefined && user === "") {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		commentService.addComment(newComment).then((result) => {
			if (result === true) {
				dispatch(changeSeverity("success"));
				dispatch(changeNotification("Comment added."));
			} else {
				dispatch(changeSeverity("error"));
				dispatch(changeNotification(result));
			}
		});
	};
	return (
		<>
			<Box>
				<Paper sx={{ display: "flex", flexWrap: "wrap" }}>
					<FormControl fullWidth>
						<TextField
							fullWidth
							onChange={(e) => {
								setNewComment(e.target.value);
							}}
							margin="normal"
							name="comment"
							label="Leave a comment"
							placeholder="comment"
							autoComplete="comment"
							required
						/>
					</FormControl>
				</Paper>
				<Button
					type="submit"
					variant="contained"
					theme={theme}
					size="large"
					sx={{ mt: 1 }}
					onSubmit={handleSubmit}
				>
					Submit
				</Button>
			</Box>
		</>
	);
};

export default NewComment;

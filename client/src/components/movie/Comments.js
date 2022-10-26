import "../../css/movie.css";
import React, { useEffect, useState } from "react";
import { Divider, Avatar, Grid, Paper } from "@mui/material";
import { Container } from "@mui/system";
import NewComment from "./NewComment";
import commentService from "../../services/commentService";
const imgLink =
	"https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const Comments = ({ movieId }) => {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		commentService.getComments(movieId).then((response) => {
			setComments(response.data.comments || "");
		});
	}, [movieId]);
	console.log(comments)
	return (
		<>
			<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
				<NewComment movieId={movieId} />
				<Paper style={{ padding: "40px 20px", marginTop: 100 }}>
					<Grid container wrap="nowrap" spacing={2}>
						<Grid item>
							<Avatar alt="Remy Sharp" src={imgLink} />
						</Grid>
						<Grid justifyContent="left" item xs zeroMinWidth>
							<h4 style={{ margin: 0, textAlign: "left" }}>
								Michel Michel
							</h4>
							<p style={{ textAlign: "left" }}>
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Aenean luctus ut est sed
								faucibus. Duis bibendum ac ex vehicula laoreet.
								Suspendisse congue vulputate lobortis.
								Pellentesque at interdum tortor. Quisque arcu
								quam, malesuada vel mauris et, posuere sagittis
								ipsum.{" "}
							</p>
							<p style={{ textAlign: "left", color: "gray" }}>
								posted 1 minute ago
							</p>
						</Grid>
					</Grid>
					<Divider variant="fullWidth" style={{ margin: "30px 0" }} />
				</Paper>
			</Container>
		</>
	);
};

export default Comments;

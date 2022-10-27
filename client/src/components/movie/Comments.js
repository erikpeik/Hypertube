import "../../css/movie.css";
import React, { useEffect, useState } from "react";
import { Divider, Avatar, Grid, Paper } from "@mui/material";
import { Container } from "@mui/system";
import NewComment from "./NewComment";
import commentService from "../../services/commentService";
import { format } from "timeago.js";
const imgLink =
	"https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const Comments = ({ movieId }) => {
	const [comments, setComments] = useState({});

	useEffect(() => {
		commentService.getComments(movieId).then((response) => {
			setComments(response || "");
		});
	}, [movieId]);

	return (
		<>
			<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
				<NewComment movieId={movieId} />
				<Paper style={{ padding: "20px 20px", marginTop: 10 }}>
					{comments.length > 0 ? (
						comments.sort((a, b) => b.id - a.id) &&
						comments.map((c) => {
							return (
								<Grid
									container
									wrap="nowrap"
									spacing={2}
									key={c.id}
								>
									<Grid item>
										<Avatar
											alt="Remy Sharp"
											src={c.user_pic}
										/>
									</Grid>
									<Grid
										justifyContent="left"
										item
										xs
										zeroMinWidth
									>
										<h4
											style={{
												margin: 0,
												textAlign: "left",
											}}
										>
											{c.username}
										</h4>
										<p style={{ textAlign: "left" }}>
											{c.comment}{" "}
										</p>
										<p
											style={{
												textAlign: "left",
												color: "gray",
											}}
										>
											{format(c.created_at)}
										</p>
										<Divider
											variant="fullWidth"
											style={{ margin: "30px 0" }}
										/>
									</Grid>
								</Grid>
							);
						})
					) : (
						<p
							style={{
								textAlign: "left",
								color: "gray",
							}}
						>
							No comments. 😔
						</p>
					)}
				</Paper>
			</Container>
		</>
	);
};

export default Comments;

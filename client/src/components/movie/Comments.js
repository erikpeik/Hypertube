import '../../css/movie.css';
import React, { useEffect, useState } from 'react';
import { Divider, Avatar, Grid, Paper } from '@mui/material';
import { Container } from '@mui/system';
import NewComment from './NewComment';
import commentService from '../../services/commentService';
import { format } from 'timeago.js';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Comments = ({ movieId, t }) => {
	const profileData = useSelector((state) => state.profile);

	const [comments, setComments] = useState({});
	const [refresh, setRefresh] = useState(null);

	useEffect(() => {
		commentService.getComments(movieId).then((response) => {
			setComments(response || '');
		});
	}, [movieId, refresh]);

	return (
		<>
			<Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
				<NewComment movieId={movieId} setRefresh={setRefresh} t={t} />
				<Paper style={{ padding: '20px 20px', marginTop: 10 }}>
					{comments && comments.length > 0 ? (
						comments.sort((a, b) => b.id - a.id) &&
						comments.map((c) => {
							let created_at = new Date(c.created_at);
							created_at.setTime(created_at.getTime() - 7200000);
							return (
								<Grid
									container
									wrap="nowrap"
									spacing={2}
									key={c.id}
								>
									{c?.user_id === profileData.id ? (
										<Grid item>
											<Link to={'/profile'}>
												<Avatar
													alt="profile picture"
													src={c?.picture_data}
												/>
											</Link>
										</Grid>
									) : (
										<Grid item>
											<Link to={'/profile/' + c?.user_id}>
												<Avatar
													alt="profile picture"
													src={c?.picture_data}
												/>
											</Link>
										</Grid>
									)}

									<Grid
										justifyContent="left"
										item
										xs
										zeroMinWidth
									>
										<h4
											style={{
												margin: 0,
												textAlign: 'left',
											}}
										>
											{c.username}
										</h4>
										<p style={{ textAlign: 'left' }}>
											{c.comment}{' '}
										</p>
										<p
											style={{
												textAlign: 'left',
												color: 'gray',
											}}
										>
											{format(created_at)}
										</p>
										<Divider
											variant="fullWidth"
											style={{ margin: '30px 0' }}
										/>
									</Grid>
								</Grid>
							);
						})
					) : (
						<p
							style={{
								textAlign: 'left',
								color: 'gray',
							}}
						>
							{t('movie.2')}
						</p>
					)}
				</Paper>
			</Container>
		</>
	);
};

export default Comments;

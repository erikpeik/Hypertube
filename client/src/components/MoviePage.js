import { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom'
import {
	Typography, Paper, Grid, Button
} from '@mui/material'
import { Container } from '@mui/system'
import Loader from "./Loader";
import browsingService from "../services/browsingService";
import streamingService from "../services/streamingService";
import VideoPlayer from "./VideoPlayer";

const MoviePage = () => {
	const [imdbData, setImdbData] = useState(null)
	const params = useParams()
	const location = useLocation()

	useEffect(() => {
		browsingService.getIMDbData({ imdb_id: params.id }).then(movieData => {
			console.log(movieData)
			setImdbData(Object.entries(movieData) || '')
		})
	}, [params])

	if (!imdbData) return <Loader />

	const torrentInfo = location.state[0].torrents

	const movieData = imdbData.filter((data, i) => i !== 14)

	return (
		<>
			<VideoPlayer />
			<Button onClick={() => {streamingService.getTorrent(params.id, torrentInfo)}}>Get Movie</Button>
			<Container maxWidth='md' sx={{ pt: 5, pb: 5 }}>
				<Paper elevation={10} sx={{ padding: 3 }}>
					{movieData.map((value, i) => (
						<Grid container key={`container${i}`} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
							<Typography sx={{ width: 'fit-content', fontWeight: '700' }}>
								{`${value[0]}:`}
							</Typography>
							<Grid item xs={12} sm={10}>
								<Typography sx={{ width: 'fit-content', wordBreak: 'break-all' }}>
									{value[1]}
								</Typography>
							</Grid>
						</Grid>
					))}
				</Paper>
			</Container>
		</>
	)
}

export default MoviePage
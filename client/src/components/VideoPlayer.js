import '../css/VideoPlayer.css';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import ReactPlayer from 'react-player/lazy';
import {
	Container, LinearProgress, Typography, Box,
	FormControl, FormControlLabel, FormLabel, Radio, RadioGroup
} from '@mui/material';
import { grey } from '@mui/material/colors';
import streamingService from '../services/streamingService';
import movieService from '../services/movieService';
// import video_banner from '../images/video_banner.png';
import { PlayCircleFilledWhiteOutlined } from '@mui/icons-material';
import browsingService from '../services/browsingService';
import NotificationSnackbar from './NotificationSnackbar';
import { changeNotification } from '../reducers/notificationReducer'
import { changeSeverity } from '../reducers/severityReducer'

const VideoPlayer = ({ imdb_id }) => {
	const dispatch = useDispatch()
	const playerRef = useRef(null);
	const buffering = useRef(false);
	const [readyToPlay, setReadyToPlay] = useState(false)
	const [statusPlayer, setStatusPlayer] = useState('');
	const [torrentInfo, setTorrentInfo] = useState([])
	const [quality, setQuality] = useState('')
	const [error, setError] = useState(false);
	const [subtitles, setSubtitles] = useState([]);

	const profileData = useSelector((state) => state.profile);

	const isWatched = () => {
		movieService.getUserWatchMovie(imdb_id, profileData.id).then((response) => {
			console.log(response);
		});
	};

	const onPlay = () => {
		setStatusPlayer('playing');
		isWatched();
		// here set the movie as watched
	};

	const onBuffer = () => {
		setStatusPlayer('buffering');
		buffering.current = true;
	};

	const onProgress = ({ playedSeconds, loadedSeconds }) => {
		if (playedSeconds > loadedSeconds && !error) {
			setStatusPlayer('movie not loaded yet');
			playerRef.current.showPreview();
		}
	};

	const onError = (error) => {
		if (error?.target?.error) {
			const error_code = error.target.error.code;
			if (
				// error_code === 3 || // failed to send audio packet for decoding
				error_code === 4 ||
				error_code === 1
			) {
				setStatusPlayer('source file error');
				console.log(error.target.error);
				setError(true);
				playerRef.current.showPreview();
			}
		}
	};

	const onPause = () => {
		setStatusPlayer('paused');
	};

	const onReady = () => {
		buffering.current = false;
	};

	const onBufferEnd = () => {
		setStatusPlayer('movie playing');
		buffering.current = false;
	};

	const onClickPreview = () => {
		setStatusPlayer('buffering');
		buffering.current = true;
	};

	useEffect(() => {
		browsingService.getSingleMovieQuery(imdb_id).then(response => {
			let torrentQualities = response.movie.torrents.map(torrent => torrent.quality)
			let uniqueQualities = torrentQualities.filter((quality, index) => {
				return torrentQualities.indexOf(quality) === index;
			})
			setTorrentInfo(uniqueQualities)
			setQuality(uniqueQualities[0])
		})
		return () => {
			if (buffering.current === true) window.location.reload();
		};
	}, [imdb_id]);

	let stream_url = `http://localhost:3001/api/moviestream/${imdb_id}/${quality}`;

	const getTorrent = () => {
		setStatusPlayer('buffering');
		buffering.current = true;
		streamingService.getTorrent(imdb_id, quality).then(async (response) => {
			let subtitles = await streamingService.getSubtitles(imdb_id)
			setSubtitles(subtitles);
			if (response.includes("Ready to play")) {
				let downloadRatio = parseInt(response.replace("Ready to play, ", ''), 10)
				if (!isNaN(downloadRatio)) {
					dispatch(changeSeverity('info'))
					dispatch(changeNotification(`Playing as a preview, ${downloadRatio} percent of the movie downloaded. Refresh the page after complete download for full quality.`));
				}
				setReadyToPlay(true);
			}
		});
	};

	const handleQuality = event => {
		console.log(event.target.value)
		setQuality(event.target.value)
	}

	return (
		<>
			<Container maxWidth="md">
				{!readyToPlay &&
					<>
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							<PlayCircleFilledWhiteOutlined
								style={{ fontSize: 100, color: 'white' }}
								cursor='pointer'
								onClick={() => {
									getTorrent();
								}} />
						</Box>
						<FormControl sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
							<FormLabel id='movie_quality' sx={{ color: grey[50] }}>Quality:</FormLabel>
							<RadioGroup
								row aria-labelledby='movie_quality' name='movie_quality' value={quality} onChange={handleQuality}>
								{torrentInfo.map((quality, i) =>
									<FormControlLabel key={i}
										sx={{ color: grey[50] }}
										value={quality}
										control={<Radio sx={{ color: grey[50], '&.Mui-checked': { color: grey[200] } }} />}
										label={quality} />
								)}
							</RadioGroup>
						</FormControl>
					</>
				}
				{readyToPlay && <ReactPlayer
					ref={playerRef}
					playing={true}
					autoPlay={true}
					controls={buffering.current === false}
					pip={false}
					url={stream_url}
					onPlay={onPlay}
					width="100%"
					height="100%"
					// light={video_banner}
					playIcon={
						<PlayCircleFilledWhiteOutlined fontSize="large" />
					}
					onBuffer={onBuffer}
					onProgress={onProgress}
					onError={onError}
					onPause={onPause}
					onReady={onReady}
					onBufferEnd={onBufferEnd}
					onClickPreview={onClickPreview}
					config={{
						file: {
							tracks: subtitles,
							attributes: { crossOrigin: 'true' },
						},
					}}
				/>}
				<NotificationSnackbar />
				<Typography variant="body2" color="initial">
					{statusPlayer}
				</Typography>
				{buffering.current === true && <LinearProgress />}
			</Container>
		</>
	);
};

export default VideoPlayer;

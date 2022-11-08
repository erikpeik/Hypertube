import '../css/VideoPlayer.css';
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Container, LinearProgress, Typography, Box } from '@mui/material';
import streamingService from '../services/streamingService';
import movieService from '../services/movieService';
// import video_banner from '../images/video_banner.png';
import { PlayCircleFilledWhiteOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const VideoPlayer = ({ imdb_id }) => {
	const playerRef = useRef(null);
	const buffering = useRef(false);
	const [readyToPlay, setReadyToPlay] = useState(false)
	const [statusPlayer, setStatusPlayer] = useState('');
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
		return () => {
			if (buffering.current === true) window.location.reload();
		};
	}, []);

	let stream_url = `http://localhost:3001/api/moviestream/${imdb_id}`;

	const getTorrent = () => {
		setStatusPlayer('buffering');
		buffering.current = true;
		streamingService.getTorrent(imdb_id).then(async (response) => {
			let subtitles = await streamingService.getSubtitles(imdb_id)
			setSubtitles(subtitles);
			if (response.includes("Ready to play")) {
				let downloadRatio = parseInt(response.replace("Ready to play, ", ''), 10)
				if (!isNaN(downloadRatio))
					setStatusPlayer(`Playing as a preview, ${downloadRatio} percent of the movie downloaded. Refresh the page in a moment for full quality.`);
				setReadyToPlay(true);
			}
		});
	};

	return (
		<>
			<Container maxWidth="md">
				{!readyToPlay &&
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<PlayCircleFilledWhiteOutlined
							style={{ fontSize: 100, color: 'white' }}
							cursor='pointer'
							onClick={() => {
								getTorrent();
							}} />
					</Box>
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
				<Typography variant="body2" color="initial">
					{statusPlayer}
				</Typography>
				{buffering.current === true && <LinearProgress />}
			</Container>
		</>
	);
};

export default VideoPlayer;

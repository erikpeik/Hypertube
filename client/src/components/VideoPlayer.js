import '../css/VideoPlayer.css';
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Container, LinearProgress, Typography } from '@mui/material';
import streamingService from '../services/streamingService';
import movieService from '../services/movieService';
import video_banner from '../images/video_banner.png';
import { PlayCircleFilledWhiteOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

const VideoPlayer = ({ imdb_id, status }) => {
	const playerRef = useRef(null);
	const buffering = useRef(false);
	const [statusPlayer, setStatusPlayer] = useState('');
	const [error, setError] = useState(false);
	const [subtitles, setSubtitles] = useState([]);

	const profileData = useSelector((state) => state.profile);
	const dispatch = useDispatch();

	useEffect(() => {
		streamingService.getSubtitles(imdb_id).then((response) => {
			console.log(response);
			setSubtitles(response);
		});
	}, [imdb_id]);

	// console.log(imdb_id)
	// console.log(profileData)

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

	let stream_url = `http://localhost:3001/api/streaming/torrent/${imdb_id}`;

	return (
		<>
			<Container maxWidth="md">
				<ReactPlayer
					ref={playerRef}
					playing={true}
					controls={buffering.current === false}
					pip={false}
					url={stream_url}
					onPlay={onPlay}
					width="100%"
					light={video_banner}
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
				/>
				<Typography variant="body2" color="initial">
					{statusPlayer}
				</Typography>
				{buffering.current === true && <LinearProgress />}
			</Container>
		</>
	);
};

export default VideoPlayer;

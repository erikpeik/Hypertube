import '../css/VideoPlayer.css';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player/lazy';
import {
	Container,
	LinearProgress,
	Typography,
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import streamingService from '../services/streamingService';
import movieService from '../services/movieService';
import { PlayCircleFilledWhiteOutlined } from '@mui/icons-material';
import browsingService from '../services/browsingService';
import NotificationSnackbar from './NotificationSnackbar';
import { changeNotification } from '../reducers/notificationReducer';
import { changeSeverity } from '../reducers/severityReducer';

const VideoPlayer = ({ imdb_id, t }) => {
	const dispatch = useDispatch();
	const playerRef = useRef(null);
	const buffering = useRef(false);
	const [readyToPlay, setReadyToPlay] = useState(false);
	const [statusPlayer, setStatusPlayer] = useState('');
	const [torrentInfo, setTorrentInfo] = useState([]);
	const [quality, setQuality] = useState('');
	const [error, setError] = useState(false);
	const [subtitles, setSubtitles] = useState([]);

	const profileData = useSelector((state) => state.profile);

	const isWatched = () => {
		movieService
			.getUserWatchMovie(imdb_id, profileData.id)
			.then((response) => {
				console.log(response);
			});
	};

	const onPlay = () => {
		setStatusPlayer(`${t('videoplayer.0')}`);
		isWatched();
	};

	const onBuffer = () => {
		setStatusPlayer(`${t('videoplayer.1')}`);
		buffering.current = true;
	};

	const onProgress = ({ playedSeconds, loadedSeconds }) => {
		if (playedSeconds > loadedSeconds && !error) {
			setStatusPlayer(t(`${t('videoplayer.2')}`));
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
				setStatusPlayer(`${t('videoplayer.3')}`);
				console.log(error.target.error);
				setError(true);
				playerRef.current.showPreview();
			}
		}
	};

	const onPause = () => {
		setStatusPlayer(`${t('videoplayer.4')}`);
	};

	const onReady = () => {
		buffering.current = false;
	};

	const onBufferEnd = () => {
		setStatusPlayer(`${t('videoplayer.5')}`);
		buffering.current = false;
	};

	const onClickPreview = () => {
		setStatusPlayer(`${t('videoplayer.1')}`);
		buffering.current = true;
	};

	useEffect(() => {
		browsingService.getSingleMovieQuery(imdb_id).then((response) => {
			if (response.movie?.torrents) {
				let torrentQualities = response.movie.torrents.map(
					(torrent) => torrent.quality
				);
				let uniqueQualities = torrentQualities.filter(
					(quality, index) => {
						return (torrentQualities.indexOf(quality) === index && quality !== '2160p');
					}
				);
				setTorrentInfo(uniqueQualities);
				setQuality(uniqueQualities[0]);
			}
		});
		return () => {
			if (buffering.current === true) window.location.reload();
		};
	}, [imdb_id]);

	let stream_url = `http://localhost:3001/api/moviestream/${imdb_id}/${quality}`;

	const getTorrent = () => {
		setStatusPlayer(`${t('videoplayer.1')}`);
		buffering.current = true;
		streamingService.getTorrent(imdb_id, quality).then(async (response) => {
			let subtitles = await streamingService.getSubtitles(imdb_id);
			setSubtitles(subtitles);
			if (response.includes('Ready to play')) {
				let downloadRatio = parseInt(
					response.replace('Ready to play, ', ''),
					10
				);
				if (!isNaN(downloadRatio)) {
					dispatch(changeSeverity('info'));
					dispatch(
						changeNotification(
							`${t('videoplayer.6')} ${downloadRatio} ${t(
								'videoplayer.7'
							)}`
						)
					);
				}
				setReadyToPlay(true);
			}
		});
	};

	const handleQuality = (event) => {
		console.log(event.target.value);
		setQuality(event.target.value);
	};

	return (
		<>
			<Container maxWidth="md">
				{!readyToPlay && (
					<>
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							<PlayCircleFilledWhiteOutlined
								style={{ fontSize: 100, color: 'white' }}
								cursor="pointer"
								onClick={() => {
									getTorrent();
								}}
							/>
						</Box>
						<FormControl
							sx={{
								display: 'flex',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<FormLabel
								id="movie_quality"
								sx={{ color: grey[50] }}
							>
								{t('videoplayer.8')}
							</FormLabel>
							<RadioGroup
								row
								aria-labelledby="movie_quality"
								name="movie_quality"
								value={quality}
								onChange={handleQuality}
							>
								{torrentInfo.map((quality, i) => (
									<FormControlLabel
										key={i}
										sx={{ color: grey[50] }}
										value={quality}
										control={
											<Radio
												sx={{
													color: grey[50],
													'&.Mui-checked': {
														color: grey[200],
													},
												}}
											/>
										}
										label={quality}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</>
				)}
				{readyToPlay && (
					<ReactPlayer
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
					/>
				)}
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

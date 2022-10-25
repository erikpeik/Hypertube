import "../css/VideoPlayer.css";
import * as React from "react";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import Container from "@mui/material/Container";
import ControlIcons from "./control/ControlIcons";

const VideoPlayer = ({ imdb_id, status }) => {
	const playerRef = useRef(null);
	const playerDivRef = useRef(null);
	const [playerState, setPlayerState] = useState({
		playing: true,
		mute: true,
		volume: 0.5,
		playerbackrate: 1.0,
		played: 0,
		seeking: false,
	});

	const { playing, mute, volume, playerbackRate, played } = playerState;

	const handlePlayAndPause = () => {
		setPlayerState({
			...playerState,
			playing: !playerState.playing,
		});
	};

	const handleRewind = () => {
		playerRef.current.seekTo(
			playerRef.current.getCurrentTime() - 10,
			`seconds`
		);
	};

	const handleFastForward = () => {
		playerRef.current.seekTo(
			playerRef.current.getCurrentTime() + 30,
			`seconds`
		);
	};

	const handlePlayerProgress = (state) => {
		if (!playerState.seeking) {
			setPlayerState({ ...playerState, ...state });
		}
	};

	const handlePlayerSeek = (newValue) => {
		setPlayerState({
			...playerState,
			played: parseFloat(newValue.target.value / 100),
		});
		playerRef.current.seekTo(parseFloat(newValue.target.value / 100));
	};

	const handlePlayerMouseSeekUp = (newValue) => {
		setPlayerState({ ...playerState, seeking: false });
		playerRef.current.seekTo(newValue.target.value / 100);
	};

	const format = (seconds) => {
		if (isNaN(seconds)) {
			return "00:00";
		}

		const date = new Date(seconds * 1000);
		const hh = date.getUTCHours();
		const mm = date.getUTCMinutes();
		const ss = date.getUTCSeconds().toString().padStart(2, "0");

		if (hh) {
			return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
		} else {
			return `${mm}:${ss}`;
		}
	};

	const currentPlayerTime = playerRef.current
		? playerRef.current.getCurrentTime()
		: "00:00";
	const movieDuration = playerRef.current
		? playerRef.current.getDuration()
		: "00:00";
	const playedTime = format(currentPlayerTime);
	const fullMovieTime = format(movieDuration);

	const handleMuting = () => {
		setPlayerState({ ...playerState, muted: !playerState.muted });
	};
	const handleVolumeChange = (e, newValue) => {
		setPlayerState({
			...playerState,
			volume: parseFloat(newValue / 100),
			mute: newValue === 0 ? true : false,
		});
	};

	const handleVolumeSeek = (e, newValue) => {
		setPlayerState({
			...playerState,
			volume: parseFloat(newValue / 100),
			mute: newValue === 0 ? true : false,
		});
	};
	const handlePlayerRate = (rate) => {
		setPlayerState({ ...playerState, playerbackRate: rate });
	};

	const handleFullScreenMode = () => {
		screenfull.toggle(playerDivRef.current);
	};

	let stream_url
	if (status === 'pending')
		stream_url = "http://localhost:3001/api/moviestream/pushthebutton"
	if (status === 'ready')
		stream_url = `http://localhost:3001/api/moviestream/${imdb_id}`

	return (
		<>
			<Container maxWidth="md">
				<div className="playerDiv" ref={playerDivRef}>
					<ReactPlayer
						width={"100%"}
						height="100%"
						url={stream_url}
						ref={playerRef}
						playing={playing}
						muted={mute}
						onProgress={handlePlayerProgress}
						playbackRate={playerbackRate}
					/>
					<ControlIcons
						playandpause={handlePlayAndPause}
						playing={playing}
						rewind={handleRewind}
						fastForward={handleFastForward}
						played={played}
						onSeek={handlePlayerSeek}
						onSeekMouseUp={handlePlayerMouseSeekUp}
						playedTime={playedTime}
						fullMovieTime={fullMovieTime}
						muting={handleMuting}
						muted={mute}
						volume={volume}
						volumeChange={handleVolumeChange}
						volumeSeek={handleVolumeSeek}
						playerbackRate={playerbackRate}
						playRate={handlePlayerRate}
						fullScreenMode={handleFullScreenMode}
					/>
				</div>
			</Container>
		</>
	);
};

export default VideoPlayer;

import "../css/VideoPlayer.css";
import * as React from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import Container from "@mui/material/Container";
import ControlIcons from "./control/ControlIcons";

const VideoPlayer = () => {
	const [playerState, setPlayerState] = useState({
		playing: true,
		mute: true,
		volume: 0.5,
		playerbackrate: 1.0,
		played: 0,
		seeking: false,
	});

	const { playing, mute, volume, playerbackRate, played, seeking } =
		playerState;

	const handlePlayAndPause = () => {
		setPlayerState({
			...playerState,
			playing: !playerState.playing,
		});
	};


	return (
		<>
			<Container maxWidth="md">
				<div className="playerDiv">
					<ReactPlayer
						width={"100%"}
						height="100%"
						url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
						playing={playing}
						muted={mute}
					/>
					<ControlIcons playandpause={handlePlayAndPause} playing={playing}/>
				</div>
			</Container>
		</>
	);
};

export default VideoPlayer;

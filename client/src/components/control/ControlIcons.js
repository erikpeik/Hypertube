import "../../css/ControlIcons.css";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import {
	FastRewind,
	PlayArrowSharp,
	FastForwardSharp,
	VolumeUp,
	Fullscreen,
    PauseSharp 
} from "@mui/icons-material";

const ControlIcons = ({ playandpause, playing }) => {
	const PrettoSlider = styled(Slider)({
		height: 5,
		"& .MuiSlider-track": {
			border: "none",
		},
		"& .MuiSlider-thumb": {
			height: 16,
			width: 16,
			backgroundColor: "#fff",
			border: "2px solid currentColor",
			"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
				boxShadow: "inherit",
			},
			"&:before": {
				display: "none",
			},
		},
		"& .MuiSlider-valueLabel": {
			lineHeight: 1.2,
			fontSize: 12,
			background: "unset",
			padding: 0,
			width: 32,
			height: 32,
			borderRadius: "50% 50% 50% 0",
			backgroundColor: "#52af77",
			transformOrigin: "bottom left",
			transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
			"&:before": { display: "none" },
			"&.MuiSlider-valueLabelOpen": {
				transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
			},
			"& > *": {
				transform: "rotate(45deg)",
			},
		},
	});
	return (
		<div className="controls__div">
			{/* Top Segment */}
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="start"
				style={{ padding: 16 }}
			>
				<Grid item>
					<Typography variant="h5" style={{ color: "white" }}>
						Player
					</Typography>
				</Grid>
			</Grid>

			{/* Middle Segment */}
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="center"
			>
				<IconButton className="controls__icons" aria-label="reqind">
					<FastRewind fontSize="large" style={{ color: "white" }} />
				</IconButton>

				<IconButton
					className="controls__icons"
					aria-label="reqind"
					onClick={playandpause}
				>
					{playing ? (
						<PauseSharp
							fontSize="large"
							style={{ color: "white" }}
						/>
					) : (
						<PlayArrowSharp
							fontSize="large"
							style={{ color: "white" }}
						/>
					)}
				</IconButton>

				<IconButton className="controls__icons" aria-label="reqind">
					<FastForwardSharp
						fontSize="large"
						style={{ color: "white" }}
					/>
				</IconButton>
			</Grid>

			{/* Bottom Segment */}
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				style={{ padding: 16 }}
			>
				<Grid item>
					<Typography variant="h5" style={{ color: "white" }}>
						Tears Of Steel
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<PrettoSlider min={0} max={100} defaultValue={20} />
					<Grid
						container
						direction="row"
						justifyContent="space-between"
					>
						<Typography variant="h7" style={{ color: "white" }}>
							00:26
						</Typography>
						<Typography variant="h7" style={{ color: "white" }}>
							12:30
						</Typography>
					</Grid>
				</Grid>

				<Grid item>
					<Grid container alignItems="center" direction="row">
						<IconButton
							className="controls__icons"
							aria-label="reqind"
							onClick={playandpause}
						>
							{playing ? (
								<PauseSharp
									fontSize="large"
									style={{ color: "white" }}
								/>
							) : (
								<PlayArrowSharp
									fontSize="large"
									style={{ color: "white" }}
								/>
							)}
						</IconButton>

						<IconButton
							className="controls__icons"
							aria-label="reqind"
						>
							<VolumeUp
								fontSize="large"
								style={{ color: "white" }}
							/>
						</IconButton>

						<Typography
							style={{ color: "#fff", paddingTop: "5px" }}
						>
							40
						</Typography>
						<Slider
							min={0}
							max={100}
							defaultValue={100}
							className="volume__slider"
						/>
					</Grid>
				</Grid>

				<Grid item>
					<Button variant="text" className="bottom__icons">
						<Typography>1X</Typography>
					</Button>

					<IconButton className="bottom__icons">
						<Fullscreen fontSize="large" />
					</IconButton>
				</Grid>
			</Grid>
		</div>
	);
};

export default ControlIcons;

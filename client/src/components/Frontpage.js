import backgroundImg from '../images/image_background.png'
import { Container, Typography, Button, Grid, ImageList, ImageListItem } from '@mui/material'
import { ReactComponent as Logo } from '../images/logo.svg'
import { Link } from 'react-router-dom'
import bittorrent from '../images/bittorrent-animation.gif'
import AspectRatio from '@mui/joy/AspectRatio';
import cover1 from '../images/images_list/1.jpg'
import cover2 from '../images/images_list/2.jpg'
import cover3 from '../images/images_list/3.jpg'
import cover4 from '../images/images_list/4.jpg'
import cover5 from '../images/images_list/5.jpg'

const Frontpage = ({t}) => {
	return (
		<>
			<Container
				maxWidth='100%'
				sx={{
					width: '100%',
					display: "flex",
					flexDirection: "column",
					backgroundImage: `url(${backgroundImg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: "repeat",
				}}
			>
				<Logo
					fill='#FFFFFF'
					style={{
						width: '300px',
						maxWidth: "80vw",
						margin: 'auto',
						marginTop: '20px'
					}}
				/>
				<Typography
					align="center"
					sx={{
						color: "white",
						margin: "auto",
						fontWeight: 700,
						fontSize: 20
					}}
				>
					{t("landing.1")}
				</Typography>
				<Button
					to="/signup"
					component={Link}
					variant="contained"
					color="primary"
					sx={{
						margin: "auto",
						marginBottom: "25px",
						marginTop: "10px",
						maxWidth: "400px",
						width: "80vw",
					}}
				>
					{t("landing.2")}
				</Button>
			</Container>
			<Container
				maxWidth="100%"
				sx={{
					display: "flex",
					backgroundColor: "black",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<Grid>
					<Typography
						align="center"
						sx={{
							color: "white",
							margin: "auto",
							fontWeight: 700,
							fontSize: 20
						}}
					>
						{t("landing.3")}
					</Typography>
					<Typography
						align="center"
						sx={{
							color: "white",
							margin: "auto",
							fontSize: 20
						}}
					>
						{t("landing.4")}
					</Typography>
				</Grid>
				<Grid item sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
					<AspectRatio ratio={1} sx={{ maxWidth: '200px', width: "20vw", mt: 1, mb: 1 }}>
						<img src={bittorrent} style={{ width: "100%" }} alt="bittorrent" />
					</AspectRatio>
				</Grid>
			</Container>
			<Container maxWidth="lg" sx={{ height: "100%", pb: 2 }}>
				<Typography
					align="center"
					sx={{ color: "white", m: "auto", fontWeight: 700, fontSize: 20, mt: 1, mb: 1 }}
				>
					{t("landing.5")}
				</Typography>
				<ImageList sx={{ width: "100%", height: "100%" }} cols={5} rowHeight="auto">
					<ImageListItem>
						<img src={cover1} alt="cover1" />
					</ImageListItem>
					<ImageListItem>
						<img src={cover2} alt="cover2" />
					</ImageListItem>
					<ImageListItem>
						<img src={cover3} alt="cover3" />
					</ImageListItem>
					<ImageListItem>
						<img src={cover4} alt="cover4" />
					</ImageListItem>
					<ImageListItem>
						<img src={cover5} alt="cover5" />
					</ImageListItem>
				</ImageList>
			</Container>
		</>
	)
}

export default Frontpage

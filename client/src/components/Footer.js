import { Typography, Link, Container } from '@mui/material'

const Footer = () => {
	return <footer className='footer'>
		<Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
			<div style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column"
			}}>
				<Typography
					varient='body2'
					color='textSecondary'
					margin='auto'
					align="center"
				>
					{"© Hypertube "}
					{new Date().getFullYear()}
				</Typography>
				<Typography varient='body1' color='textSecondary' align='center'>
					<Link fontWeight='600' color='inherit' underline='none'
						href='https://github.com/SeanTroy'>plehtika</Link>
					{" & "}
					<Link fontWeight='600' color='inherit' underline='none'
						href='https://github.com/acamaras0'>acamaras</Link>
					{" & "}
					<Link fontWeight='600' color='inherit' underline='none'
						href='https://github.com/erikpeik'>emende</Link>
					{" & "}
					<Link fontWeight='600' color='inherit' underline='none'
						href='https://github.com/mobahug'>ghorvath</Link>
				</Typography>
			</div>
		</Container>
	</footer>
}

export default Footer

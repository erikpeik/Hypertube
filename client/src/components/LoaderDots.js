import { motion } from 'framer-motion';

const loadingContainer = {
	width: '4em',
	height: '4em',
	display: 'flex',
	justifyContent: 'space-around'
}

const loadingCircle = {
	display: 'block',
	width: '1em',
	height: '1em',
	backgroundColor: '#6e6af7',
	borderRadius: '0.5rem'
}

const loadingContainerVariants = {
	start: {
		transition: {
			staggerChildren: 0.2,
		},
	},
	end: {
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const loadingCircleVariants = {
	start: {
		y: "0%",
	},
	end: {
		y: "60%",
	},
};
const loadingCircleTransition = {
	duration: 0.4,
	repeat: Infinity,
	repeatType: "reverse",
	ease: 'easeInOut'
}

const LoaderDots = () => {
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<motion.div
				style={loadingContainer}
				variants={loadingContainerVariants}
				initial="start"
				animate="end"
			>
				<motion.span
					style={loadingCircle}
					variants={loadingCircleVariants}
					transition={loadingCircleTransition}
				></motion.span>
				<motion.span
					style={loadingCircle}
					variants={loadingCircleVariants}
					transition={loadingCircleTransition}
				></motion.span>
				<motion.span
					style={loadingCircle}
					variants={loadingCircleVariants}
					transition={loadingCircleTransition}
				></motion.span>
			</motion.div>
		</div>
	)
}

export default LoaderDots

import { useEffect } from 'react'
import { Button } from '@mui/material'
import { useSelector } from 'react-redux'
import signUpService from '../services/signUpService'
import { useNavigate } from 'react-router-dom'

const GithubAuth = () => {
	const user = useSelector(state => state.user)
	const navigate = useNavigate()

	useEffect(() => {
		const token = new URLSearchParams(window.location.search).get(
			"access_token");
		console.log(token)

		signUpService.checkGithubConnection({ token: token })
			.then((response) => {
				if (response.data !== false)
					navigate('/profile')
			})
			.catch((error) => {
				console.log("error " + error);
			});
	}, [navigate]);

	if (user === '') {
		return (
			<>
				<img
					alt='githublogo'
					src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
					width="150"
				></img>
				<h1 >Sign in with GitHub</h1>
				<Button
					type="primary"
					className="btn"
					size="lg"
					href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`}
				>
					Sign in
				</Button>
			</>
		)
	}
}

export default GithubAuth
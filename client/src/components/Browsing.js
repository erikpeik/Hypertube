import browsingService from "../services/browsingService"
import { useState, useEffect } from "react"

const Browsing = () => {
	const [movies, setMovies] = useState(null)
	useEffect(() => {
		browsingService.getMovies().then((movies) => {
			console.log(movies.data)
			setMovies(movies.data.movies || [])
		})
	}, [])
	if (!movies) return <div>Loading...</div>

	return (
		<>
			<h1>Browsing</h1>
			{movies.map(movie => (
			<div key={movie.id}>
					<h2>{movie.title}</h2>
					<img src={movie.medium_cover_image} alt={movie.title} />
				</div>
			))}
		</>
	)
}

export default Browsing

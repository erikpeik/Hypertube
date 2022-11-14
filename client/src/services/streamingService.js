import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/streaming`

const getTorrent = (imdb_id, quality) => {
	const request = axios.get(`${baseUrl}/torrent/${imdb_id}/${quality}`)
	return request.then(response => response.data)
}

const downloadSubs = (imdb_id) => {
	const request = axios.get(`${baseUrl}/download_subs/${imdb_id}`)
	return request.then(response => response.data)
}

const getSubtitles = (imdb_id) => {
	const request = axios.get(`${baseUrl}/subs/${imdb_id}`)
	return request.then(response => response.data)
}

const streamingService = { getTorrent, downloadSubs, getSubtitles }

export default streamingService

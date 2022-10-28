import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/streaming'

const getTorrent = (imdb_id) => {
	const request = axios.post(`${baseUrl}/torrent/${imdb_id}`)
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

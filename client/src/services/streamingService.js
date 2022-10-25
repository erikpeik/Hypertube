import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/streaming'

const getTorrent = (id) => {
	const request = axios.post(`${baseUrl}/torrent/${id}`)
	return request.then(response => response.data)
}

const streamingService = { getTorrent }

export default streamingService

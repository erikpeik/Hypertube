const app = require('./app')
const http = require("http").Server(app);

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

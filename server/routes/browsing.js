module.exports = function (app, pool, bcrypt, cookieParser, bodyParser, jwt) {
  const axios = require("axios");
  const baseUrl = "/api/browsing";
  const TORRENT_API = process.env.TORRENT_API;
  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  app.get(`${baseUrl}/movies`, (req, res) => {
    axios
      .get(`${TORRENT_API}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ error: "Something went wrong" });
      });
  });

  app.post(`${baseUrl}/imdb_data`, async (req, res) => {
    const imdb_id = req.body.imdb_id;

    const { data } = await axios.get(
      `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdb_id}`
    );
    res.status(200).send(data);
  });
};

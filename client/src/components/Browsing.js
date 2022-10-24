import browsingService from "../services/browsingService";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "./style.css";
import { useNavigate } from "react-router-dom";

const Browsing = () => {
  const [movies, setMovies] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    browsingService.getMovies().then((movies) => {
      console.log(movies.data);
      setMovies(movies.data.movies || []);
    });
  }, []);

  if (!movies) return <Loader />;

  const navigateToMovie = (movie_id) => {
    navigate(`/movie/${movie_id}`);
  };

  return (
    <Box
      container="true"
      spacing={3}
      style={{
        direction: "column",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {movies.map((movie) => (
        <Box
          class="container"
          key={movie.id}
          item="true"
          xs={3}
          onClick={() => navigateToMovie(movie.imdb_code)}
        >
          <Card sx={{ flexGrow: 1, height: 345, width: 245 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image={movie.medium_cover_image}
                alt={movie.title}
              />
              <CardContent>
                <Typography class="newsletter" gutterBottom variant="h7">
                  {movie.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default Browsing;

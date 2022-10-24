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
        width: '100%',
        height: '100%'
      }}
    >
      {movies.map((movie) => (
        <Box
          sx={{ margin: 1, marginBottom: 20, maxHeight: 345, maxWidth: 245}}
          key={movie.id}
          item="true"
          xs={3}
          onClick={() => navigateToMovie(movie.imdb_code)}
        >
          <Card class="container" sx={{ flexGrow: 1}}>
            <CardActionArea>
              <CardContent
                style={{
                  textOverflow: "ellipsis",
                }}
                class="newsletter"
              >
                <Typography
                  gutterBottom
                  variant="h7"
                  style={{
                    whiteSpace: "pre-line",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    hyphens: "auto",

                  }}
                >
                  {movie.title}
                </Typography>
              </CardContent>
              <CardMedia
                sx={{ borderRadius: 2 }}
                component="img"
                image={movie.medium_cover_image}
                alt={movie.title}
              />
            </CardActionArea>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default Browsing;

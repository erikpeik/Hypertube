import browsingService from "../services/browsingService";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Input,
  Button,
  CardActionArea,
  Paper,
} from "@mui/material";
import "../css/style.css";
import { useNavigate } from "react-router-dom";

const Browsing = () => {
  const [movies, setMovies] = useState(null);
  const navigate = useNavigate();

  const goSomewhere = (event) => {
    event.preventDefault();
    const query = event.target[0].value.trim();

    browsingService.getMovieQuery({ query }).then((movies) => {
      console.log(movies.data.movies);
      setMovies(movies.data.movies || []);
    });
  };

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
    <>
      <Paper
        style={{
          direction: "column",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: 400,
          height: "100%",
          margin: 10,
        }}
      >
        <form style={{ margin: 10 }} onSubmit={goSomewhere}>
          <Input type="text" placeholder="Search" />
          <Button type="submit">Search</Button>
        </form>
      </Paper>
      <Box
        container="true"
        spacing={3}
        style={{
          direction: "column",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          height: "100%",
        }}
      >
        {movies.map((movie) => (
          <Box
            sx={{ margin: 1, marginBottom: 10, maxHeight: 345, maxWidth: 245 }}
            key={movie.id}
            item="true"
            xs={3}
            onClick={() => navigateToMovie(movie.imdb_code)}
          >
            <Card className="container" sx={{ flexGrow: 1 }}>
              <CardActionArea>
                <CardContent
                  style={{
                    textOverflow: "ellipsis",
                  }}
                  className="newsletter"
                >
                  <Typography
                    gutterBottom
                    variant="h7"
                    style={{
                      whiteSpace: "pre-line",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      hyphens: "auto",
                      overflow: "hidden",
                    }}
                  >
                    {movie.title_long}
                  </Typography>
                  <Typography>IMDB rate: {movie.rating}</Typography>
                </CardContent>
                <CardMedia
                  sx={{ borderRadius: 1 }}
                  component="img"
                  image={movie.medium_cover_image}
                  alt={movie.title_long}
                />
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Browsing;

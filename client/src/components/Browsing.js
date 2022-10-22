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

const Browsing = () => {
  const [movies, setMovies] = useState(null);
  useEffect(() => {
    browsingService.getMovies().then((movies) => {
      console.log(movies.data);
      setMovies(movies.data.movies || []);
    });
  }, []);
  if (!movies) return <Loader />;

  return (
    <Box
      container
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
        <Box key={movie.id} item xs={3}>
          <Card
            class="container"
            sx={{ margin: 2, flexGrow: 1, height: 345, width: 245 }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                image={movie.medium_cover_image}
                alt={movie.title}
              />
              <CardContent className="newsletter">
                <Typography gutterBottom variant="h7">
                  {movie.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div class="container">
            <div class="newsletter">
              <p>weee!</p>
            </div>
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default Browsing;

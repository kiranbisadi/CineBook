const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const Movie = require("./models/Movie");

const movies = [
  "RRR",
  "Kalki 2898 AD",
  "Sita Ramam",
  "Pushpa 2",
  "Baahubali 2",
];

async function addMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const title of movies) {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: { query: title },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          },
        }
      );

      const movie = response.data.results[0];

      if (!movie) {
        console.log("Movie not found:", title);
        continue;
      }

      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "";

      await Movie.findOneAndUpdate(
        { title: movie.title },
        {
          title: movie.title,
          description: movie.overview || "Movie description",
          genre: ["Drama"],
          language: "English",
          duration: 120,
          releaseDate: movie.release_date || new Date(),
          poster,
          rating: movie.vote_average || 0,
          status: "active",
        },
        { upsert: true, new: true }
      );

      console.log("Added:", movie.title);
    }

    console.log("Done!");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

addMovies();
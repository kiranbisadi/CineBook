import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait a moment after typing before searching, so we
    // don't send a request on every single keystroke
    const timer = setTimeout(() => {
      getMovies();
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const getMovies = async () => {
    try {
      setLoading(true);

      const response = await api.get("/movies", {
        params: search ? { search } : {},
      });

      setMovies(response.data.movies);
    } catch (error) {
      console.log("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Movies
      </h1>

      <input
        type="text"
        placeholder="Search movies by title..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full max-w-md border p-3 rounded mb-6"
      />

      {loading ? (
        <p className="text-center mt-10">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {movies.map((movie) => (

            <Link
              key={movie._id}
              to={`/movies/${movie._id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg"
            >

              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-4">

                <h2 className="text-xl font-bold">
                  {movie.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {movie.language}
                </p>

                <p className="mt-2">
                  ⭐ {movie.rating}
                </p>

              </div>

            </Link>

          ))}

        </div>
      )}

    </div>
  );
}

export default Movies;
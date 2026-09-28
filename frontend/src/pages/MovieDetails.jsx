import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatDate, dateKey, todayKey, nowTime } from "../utils/format";

// Keep only shows that have not started yet
const isUpcoming = (show) => {
  // Skip shows whose theatre or screen was deleted
  if (!show.theatreId || !show.screenId) return false;

  const date = dateKey(show.showDate);
  const today = todayKey();

  if (date > today) return true;
  if (date === today) return show.startTime > nowTime();

  return false;
};

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get the movie
        const movieResponse = await api.get(`/movies/${id}`);
        setMovie(movieResponse.data.movie);

        // 2. Get the shows of this movie
        const showsResponse = await api.get("/shows/public", {
          params: { movieId: id },
        });

        const upcomingShows = showsResponse.data.shows.filter(isUpcoming);
        setShows(upcomingShows);

        if (upcomingShows.length > 0) {
          setSelectedDate(dateKey(upcomingShows[0].showDate));
        }
      } catch (error) {
        console.log("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const scrollToShows = () => {
    document
      .getElementById("showtimes")
      .scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <p className="text-center mt-10">Loading movie...</p>;
  }

  if (!movie) {
    return <p className="text-center mt-10">Movie not found</p>;
  }

  // List of dates that have shows
  const dates = [...new Set(shows.map((show) => dateKey(show.showDate)))];

  // Shows on the selected date, grouped by theatre
  const showsForDate = shows.filter(
    (show) => dateKey(show.showDate) === selectedDate
  );

  const theatreGroups = {};

  showsForDate.forEach((show) => {
    const theatreId = show.theatreId._id;

    if (!theatreGroups[theatreId]) {
      theatreGroups[theatreId] = { theatre: show.theatreId, shows: [] };
    }

    theatreGroups[theatreId].shows.push(show);
  });

  const groups = Object.values(theatreGroups);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Movie details */}
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full max-w-md rounded-lg shadow"
        />

        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <p className="text-gray-600 mb-4">{movie.description}</p>

          <p className="mb-2">
            <strong>Language:</strong> {movie.language}
          </p>

          <p className="mb-2">
            <strong>Duration:</strong> {movie.duration} minutes
          </p>

          <p className="mb-2">
            <strong>Rating:</strong> ⭐ {movie.rating}
          </p>

          <p className="mb-2">
            <strong>Release Date:</strong>{" "}
            {new Date(movie.releaseDate).toLocaleDateString()}
          </p>

          <p className="mb-4">
            <strong>Genre:</strong> {movie.genre.join(", ")}
          </p>

          <button
            onClick={scrollToShows}
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Book Tickets
          </button>
        </div>
      </div>

      {/* Showtimes */}
      <div id="showtimes" className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Showtimes</h2>

        {shows.length === 0 ? (
          <p className="text-gray-600">
            No upcoming shows for this movie yet.
          </p>
        ) : (
          <>
            {/* Date buttons */}
            <div className="flex gap-3 flex-wrap mb-6">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-2 rounded border ${
                    date === selectedDate
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>

            {/* Theatres and their show times */}
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.theatre._id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">
                    {group.theatre.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    {group.theatre.address}, {group.theatre.city}
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    {group.shows.map((show) => (
                      <button
                        key={show._id}
                        onClick={() => navigate(`/shows/${show._id}/seats`)}
                        className="border border-green-600 text-green-700 rounded px-4 py-2 hover:bg-green-50"
                      >
                        <span className="font-semibold">{show.startTime}</span>
                        <span className="block text-xs text-gray-500">
                          ₹{show.ticketPrice} · {show.screenId.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;

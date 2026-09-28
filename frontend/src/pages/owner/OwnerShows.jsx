import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatDate, getErrorMessage, todayKey } from "../../utils/format";
import OwnerNav from "./OwnerNav";

function OwnerShows() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    movieId: "",
    screenId: "",
    showDate: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [showsResponse, moviesResponse, screensResponse] =
          await Promise.all([
            api.get("/shows/my-shows"),
            api.get("/movies"),
            api.get("/screens/my-screens"),
          ]);

        setShows(showsResponse.data.shows);
        setMovies(moviesResponse.data.movies);
        setScreens(screensResponse.data.screens);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reloadKey]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const selectedScreen = screens.find(
      (screen) => screen._id === form.screenId
    );

    try {
      setSubmitting(true);

      await api.post("/shows", {
        movieId: form.movieId,
        theatreId: selectedScreen?.theatreId?._id,
        screenId: form.screenId,
        showDate: form.showDate,
        startTime: form.startTime,
        endTime: form.endTime,
        ticketPrice: Number(form.ticketPrice),
      });

      setMessage("Show added successfully!");
      setForm({
        movieId: "",
        screenId: "",
        showDate: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
      });
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      <OwnerNav />

      {/* Add show form */}
      <div className="border rounded-lg p-4 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Show</h2>

        {screens.length === 0 ? (
          <p className="text-gray-600">
            You need at least one screen before you can add a show.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <select
              name="movieId"
              value={form.movieId}
              onChange={handleChange}
              className="border p-3 rounded sm:col-span-2"
              required
            >
              <option value="">Select movie</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>

            <select
              name="screenId"
              value={form.screenId}
              onChange={handleChange}
              className="border p-3 rounded sm:col-span-2"
              required
            >
              <option value="">Select screen</option>
              {screens.map((screen) => (
                <option key={screen._id} value={screen._id}>
                  {screen.theatreId?.name} - {screen.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="showDate"
              min={todayKey()}
              value={form.showDate}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="number"
              name="ticketPrice"
              placeholder="Ticket price (₹)"
              min="0"
              value={form.ticketPrice}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="sm:col-span-2 bg-red-600 text-white p-3 rounded disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Show"}
            </button>
          </form>
        )}

        {message && <p className="text-green-700 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Show list */}
      <h2 className="text-xl font-semibold mb-4">Your Shows</h2>

      {loading ? (
        <p>Loading shows...</p>
      ) : shows.length === 0 ? (
        <p className="text-gray-600">No shows added yet.</p>
      ) : (
        <div className="space-y-3">
          {shows.map((show) => (
            <div key={show._id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold">{show.movieId?.title}</h3>
              <p className="text-gray-600 text-sm">
                {show.theatreId?.name} · {show.screenId?.name}
              </p>
              <p className="text-sm mt-1">
                {formatDate(show.showDate)} · {show.startTime} -{" "}
                {show.endTime} · ₹{show.ticketPrice}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerShows;

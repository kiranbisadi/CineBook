import { useEffect, useState } from "react";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/format";
import AdminNav from "./AdminNav";

const emptyForm = {
  title: "",
  description: "",
  genre: "",
  language: "",
  duration: "",
  releaseDate: "",
  poster: "",
  rating: "",
};

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data.movies);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [reloadKey]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      setSubmitting(true);

      await api.post("/movies", {
        title: form.title,
        description: form.description,
        // Comma-separated text -> array of trimmed genre names
        genre: form.genre.split(",").map((item) => item.trim()).filter(Boolean),
        language: form.language,
        duration: Number(form.duration),
        releaseDate: form.releaseDate,
        poster: form.poster,
        rating: form.rating ? Number(form.rating) : undefined,
      });

      setMessage("Movie added successfully!");
      setForm(emptyForm);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this movie?");
    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/movies/${id}`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <AdminNav />

      {/* Add movie form */}
      <div className="border rounded-lg p-4 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Movie</h2>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border p-3 rounded sm:col-span-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 rounded sm:col-span-2"
            rows={3}
            required
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre (comma separated, e.g. Action, Drama)"
            value={form.genre}
            onChange={handleChange}
            className="border p-3 rounded sm:col-span-2"
            required
          />

          <input
            type="text"
            name="language"
            placeholder="Language"
            value={form.language}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            min="1"
            value={form.duration}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="date"
            name="releaseDate"
            value={form.releaseDate}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <input
            type="number"
            name="rating"
            placeholder="Rating (0-10, optional)"
            min="0"
            max="10"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="poster"
            placeholder="Poster image URL"
            value={form.poster}
            onChange={handleChange}
            className="border p-3 rounded sm:col-span-2"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 bg-red-600 text-white p-3 rounded disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Movie"}
          </button>
        </form>

        {message && <p className="text-green-700 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Movie list */}
      <h2 className="text-xl font-semibold mb-4">All Movies</h2>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-600">No movies added yet.</p>
      ) : (
        <div className="space-y-3">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-gray-600 text-sm">
                  {movie.language} · {movie.duration} min · ⭐ {movie.rating}
                </p>
              </div>

              <button
                onClick={() => handleDelete(movie._id)}
                className="text-red-700 underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMovies;

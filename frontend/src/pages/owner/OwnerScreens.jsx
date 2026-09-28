import { useEffect, useState } from "react";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/format";
import OwnerNav from "./OwnerNav";

function OwnerScreens() {
  const [screens, setScreens] = useState([]);
  const [approvedTheatres, setApprovedTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    theatreId: "",
    name: "",
    rows: "",
    seatsPerRow: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [screensResponse, theatresResponse] = await Promise.all([
          api.get("/screens/my-screens"),
          api.get("/theatres/my-theatres"),
        ]);

        setScreens(screensResponse.data.screens);

        setApprovedTheatres(
          theatresResponse.data.theatres.filter(
            (theatre) => theatre.status === "approved"
          )
        );
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

    const rows = Number(form.rows);
    const seatsPerRow = Number(form.seatsPerRow);

    try {
      setSubmitting(true);

      await api.post("/screens", {
        theatreId: form.theatreId,
        name: form.name,
        rows,
        seatsPerRow,
        totalSeats: rows * seatsPerRow,
      });

      setMessage("Screen added successfully!");
      setForm({ theatreId: "", name: "", rows: "", seatsPerRow: "" });
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

      {/* Add screen form */}
      <div className="border rounded-lg p-4 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Screen</h2>

        {approvedTheatres.length === 0 ? (
          <p className="text-gray-600">
            You need at least one **approved** theatre before you can add a
            screen.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <select
              name="theatreId"
              value={form.theatreId}
              onChange={handleChange}
              className="border p-3 rounded sm:col-span-2"
              required
            >
              <option value="">Select theatre</option>
              {approvedTheatres.map((theatre) => (
                <option key={theatre._id} value={theatre._id}>
                  {theatre.name} ({theatre.city})
                </option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="Screen name (e.g. Screen 1)"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded sm:col-span-2"
              required
            />

            <input
              type="number"
              name="rows"
              placeholder="Number of rows (A, B, C...)"
              min="1"
              value={form.rows}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <input
              type="number"
              name="seatsPerRow"
              placeholder="Seats per row"
              min="1"
              value={form.seatsPerRow}
              onChange={handleChange}
              className="border p-3 rounded"
              required
            />

            <p className="sm:col-span-2 text-sm text-gray-500">
              Total seats: {(Number(form.rows) || 0) * (Number(form.seatsPerRow) || 0)}{" "}
              (maximum 50, maximum 26 rows)
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="sm:col-span-2 bg-red-600 text-white p-3 rounded disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Screen"}
            </button>
          </form>
        )}

        {message && <p className="text-green-700 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Screen list */}
      <h2 className="text-xl font-semibold mb-4">Your Screens</h2>

      {loading ? (
        <p>Loading screens...</p>
      ) : screens.length === 0 ? (
        <p className="text-gray-600">No screens added yet.</p>
      ) : (
        <div className="space-y-3">
          {screens.map((screen) => (
            <div
              key={screen._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-bold">{screen.name}</h3>
              <p className="text-gray-600 text-sm">
                {screen.theatreId?.name}, {screen.theatreId?.city}
              </p>
              <p className="text-sm mt-1">
                {screen.rows} rows × {screen.seatsPerRow} seats ={" "}
                {screen.totalSeats} total seats
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerScreens;

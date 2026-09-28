import { useEffect, useState } from "react";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/format";
import OwnerNav from "./OwnerNav";

// Colour shown next to each theatre's status
const statusStyle = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  inactive: "bg-gray-200 text-gray-600",
};

function OwnerTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({ name: "", address: "", city: "" });
  const [submitting, setSubmitting] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadTheatres = async () => {
      try {
        const response = await api.get("/theatres/my-theatres");
        setTheatres(response.data.theatres);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadTheatres();
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
      await api.post("/theatres", form);

      setMessage("Theatre added! It is now waiting for admin approval.");
      setForm({ name: "", address: "", city: "" });
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

      {/* Add theatre form */}
      <div className="border rounded-lg p-4 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Theatre</h2>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            name="name"
            placeholder="Theatre name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-3 bg-red-600 text-white p-3 rounded disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Theatre"}
          </button>
        </form>

        {message && <p className="text-green-700 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Theatre list */}
      <h2 className="text-xl font-semibold mb-4">Your Theatres</h2>

      {loading ? (
        <p>Loading theatres...</p>
      ) : theatres.length === 0 ? (
        <p className="text-gray-600">
          You haven't added any theatres yet. Add one above to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold">{theatre.name}</h3>
                <p className="text-gray-600 text-sm">
                  {theatre.address}, {theatre.city}
                </p>

                {theatre.status === "rejected" && theatre.rejectionReason && (
                  <p className="text-red-600 text-sm mt-1">
                    Reason: {theatre.rejectionReason}
                  </p>
                )}
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full capitalize ${
                  statusStyle[theatre.status]
                }`}
              >
                {theatre.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerTheatres;

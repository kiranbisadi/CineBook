import { useEffect, useState } from "react";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/format";
import AdminNav from "./AdminNav";

const TABS = ["pending", "approved", "rejected"];

function AdminTheatres() {
  const [tab, setTab] = useState("pending");
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rejectingId, setRejectingId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadTheatres = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/theatres", {
          params: { status: tab },
        });
        setTheatres(response.data.theatres);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadTheatres();
  }, [tab, reloadKey]);

  const handleApprove = async (id) => {
    try {
      setError("");
      await api.put(`/admin/theatres/${id}/approve`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      setError("Please enter a reason for rejection");
      return;
    }

    try {
      setError("");
      await api.put(`/admin/theatres/${id}/reject`, { rejectionReason });

      setRejectingId("");
      setRejectionReason("");
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <AdminNav />

      <h2 className="text-xl font-semibold mb-4">Theatres</h2>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map((status) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`px-4 py-2 rounded capitalize ${
              tab === status
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : theatres.length === 0 ? (
        <p className="text-gray-600">No {tab} theatres.</p>
      ) : (
        <div className="space-y-4">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-bold">{theatre.name}</h3>
              <p className="text-gray-600 text-sm">
                {theatre.address}, {theatre.city}
              </p>
              <p className="text-sm mt-1">
                Owner: {theatre.ownerId?.name} · {theatre.ownerId?.email}
              </p>

              {theatre.rejectionReason && (
                <p className="text-red-600 text-sm mt-1">
                  Reason: {theatre.rejectionReason}
                </p>
              )}

              {tab === "pending" &&
                (rejectingId === theatre._id ? (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Reason for rejection"
                      value={rejectionReason}
                      onChange={(event) =>
                        setRejectionReason(event.target.value)
                      }
                      className="border p-2 rounded w-full mb-2"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(theatre._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId("");
                          setRejectionReason("");
                        }}
                        className="border px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(theatre._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(theatre._id)}
                      className="border border-red-600 text-red-600 px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTheatres;

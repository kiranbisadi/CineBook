import { useEffect, useState } from "react";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/format";
import AdminNav from "./AdminNav";

function AdminTheatreOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Which owner's reject box is open (holds the owner id, or "")
  const [rejectingId, setRejectingId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const response = await api.get("/admin/theatre-owners/pending");
        setOwners(response.data.owners);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadOwners();
  }, [reloadKey]);

  const handleApprove = async (id) => {
    try {
      setError("");
      await api.put(`/admin/theatre-owners/${id}/approve`);
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
      await api.put(`/admin/theatre-owners/${id}/reject`, {
        rejectionReason,
      });

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

      <h2 className="text-xl font-semibold mb-4">
        Pending Theatre Owner Requests
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : owners.length === 0 ? (
        <p className="text-gray-600">No pending theatre owner requests.</p>
      ) : (
        <div className="space-y-4">
          {owners.map((owner) => (
            <div key={owner._id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold">{owner.businessName}</h3>
              <p className="text-gray-600 text-sm">{owner.address}</p>
              <p className="text-sm mt-1">
                {owner.userId?.name} · {owner.userId?.email} ·{" "}
                {owner.userId?.phone}
              </p>

              {rejectingId === owner._id ? (
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
                      onClick={() => handleReject(owner._id)}
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
                    onClick={() => handleApprove(owner._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectingId(owner._id)}
                    className="border border-red-600 text-red-600 px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTheatreOwners;

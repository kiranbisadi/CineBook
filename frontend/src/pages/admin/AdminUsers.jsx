import { useEffect, useState } from "react";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/format";
import AdminNav from "./AdminNav";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.users);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [reloadKey]);

  const handleBlock = async (id) => {
    try {
      setError("");
      await api.put(`/admin/users/${id}/block`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleUnblock = async (id) => {
    try {
      setError("");
      await api.put(`/admin/users/${id}/unblock`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/admin/users/${id}`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <AdminNav />

      <h2 className="text-xl font-semibold mb-4">All Users</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.status === "blocked"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {user.role === "admin" ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {user.status === "blocked" ? (
                          <button
                            onClick={() => handleUnblock(user._id)}
                            className="text-green-700 underline"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(user._id)}
                            className="text-yellow-700 underline"
                          >
                            Block
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-700 underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

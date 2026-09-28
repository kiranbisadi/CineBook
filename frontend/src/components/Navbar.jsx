import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
        <Link to="/" className="text-2xl font-bold">
          CineBook
        </Link>

        <div className="flex gap-6 items-center flex-wrap">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>

          {token && user ? (
            <>
              {/* Normal user links */}
              {user.role === "user" && (
                <Link to="/bookings">My Bookings</Link>
              )}

              {/* Theatre owner links */}
              {user.role === "theatreOwner" && (
                <Link to="/owner/theatres">Owner Dashboard</Link>
              )}

              {/* Admin links */}
              {user.role === "admin" && (
                <Link to="/admin/theatre-owners">Admin Dashboard</Link>
              )}

              <Link to="/profile">Profile</Link>

              <button onClick={handleLogout} className="text-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

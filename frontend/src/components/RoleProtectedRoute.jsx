import { Navigate } from "react-router-dom";

// Only lets a specific role open the page.
// Not logged in -> sends to login.
// Logged in but wrong role -> sends home.
function RoleProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJson);

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;

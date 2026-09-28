import { Navigate } from "react-router-dom";

// Only lets logged-in users open the page.
// Everyone else is sent to the login page.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

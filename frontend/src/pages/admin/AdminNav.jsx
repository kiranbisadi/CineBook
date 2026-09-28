import { NavLink } from "react-router-dom";

// Small tab bar shown on every admin dashboard page
function AdminNav() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded ${
      isActive ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"
    }`;

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <NavLink to="/admin/theatre-owners" className={linkClass}>
        Theatre Owners
      </NavLink>
      <NavLink to="/admin/theatres" className={linkClass}>
        Theatres
      </NavLink>
      <NavLink to="/admin/users" className={linkClass}>
        Users
      </NavLink>
      <NavLink to="/admin/movies" className={linkClass}>
        Movies
      </NavLink>
    </div>
  );
}

export default AdminNav;

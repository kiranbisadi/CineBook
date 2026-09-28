import { NavLink } from "react-router-dom";

// Small tab bar shown on every owner dashboard page
function OwnerNav() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded ${
      isActive ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"
    }`;

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <NavLink to="/owner/theatres" className={linkClass}>
        My Theatres
      </NavLink>
      <NavLink to="/owner/screens" className={linkClass}>
        My Screens
      </NavLink>
      <NavLink to="/owner/shows" className={linkClass}>
        My Shows
      </NavLink>
    </div>
  );
}

export default OwnerNav;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SelectSeats from "./pages/SelectSeats";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";

import OwnerTheatres from "./pages/owner/OwnerTheatres";
import OwnerScreens from "./pages/owner/OwnerScreens";
import OwnerShows from "./pages/owner/OwnerShows";

import AdminTheatreOwners from "./pages/admin/AdminTheatreOwners";
import AdminTheatres from "./pages/admin/AdminTheatres";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMovies from "./pages/admin/AdminMovies";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages that need login (any role) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shows/:showId/seats"
          element={
            <ProtectedRoute>
              <SelectSeats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Theatre owner dashboard */}
        <Route
          path="/owner/theatres"
          element={
            <RoleProtectedRoute allowedRole="theatreOwner">
              <OwnerTheatres />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/owner/screens"
          element={
            <RoleProtectedRoute allowedRole="theatreOwner">
              <OwnerScreens />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/owner/shows"
          element={
            <RoleProtectedRoute allowedRole="theatreOwner">
              <OwnerShows />
            </RoleProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin/theatre-owners"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminTheatreOwners />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/theatres"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminTheatres />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminUsers />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/movies"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminMovies />
            </RoleProtectedRoute>
          }
        />

        {/* Any other address */}
        <Route
          path="*"
          element={<p className="text-center mt-10">Page not found</p>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

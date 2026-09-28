import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { formatDate, getErrorMessage } from "../utils/format";

// Decide which label to show on each booking
const getStatus = (booking, isPaid) => {
  if (booking.status === "cancelled") {
    return { text: "Cancelled", style: "bg-red-100 text-red-700" };
  }

  if (isPaid) {
    return { text: "Confirmed & Paid", style: "bg-green-100 text-green-700" };
  }

  return { text: "Payment pending", style: "bg-yellow-100 text-yellow-700" };
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [paidBookingIds, setPaidBookingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Change this number to load the bookings again
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingsResponse, paymentsResponse] = await Promise.all([
          api.get("/bookings/my-bookings"),
          api.get("/payments/my-payments"),
        ]);

        setBookings(bookingsResponse.data.bookings);

        // IDs of bookings that already have a payment
        const ids = paymentsResponse.data.payments
          .filter((payment) => payment.bookingId)
          .map((payment) => payment.bookingId._id);

        setPaidBookingIds(ids);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reloadKey]);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.put(`/bookings/${bookingId}/cancel`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {bookings.length === 0 ? (
        <div>
          <p className="mb-4">You have no bookings yet.</p>
          <Link to="/movies" className="text-red-600 underline">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const show = booking.showId;
            const isPaid = paidBookingIds.includes(booking._id);
            const status = getStatus(booking, isPaid);

            return (
              <div
                key={booking._id}
                className="border rounded-lg p-4 shadow-sm flex gap-4"
              >
                {show?.movieId?.poster && (
                  <img
                    src={show.movieId.poster}
                    alt={show.movieId.title}
                    className="w-24 h-32 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-xl font-bold">
                      {show ? show.movieId?.title : "Show no longer available"}
                    </h2>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${status.style}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  {show && (
                    <p className="text-gray-600">
                      {show.theatreId?.name}, {show.theatreId?.city} ·{" "}
                      {show.screenId?.name}
                    </p>
                  )}

                  {show && (
                    <p>
                      {formatDate(show.showDate)} · {show.startTime}
                    </p>
                  )}

                  <p>
                    <strong>Seats:</strong> {booking.seats.join(", ")}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{booking.totalAmount}
                  </p>

                  {booking.status === "booked" && (
                    <div className="flex gap-3 mt-3">
                      {!isPaid && (
                        <Link
                          to={`/payment/${booking._id}`}
                          className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Pay Now
                        </Link>
                      )}

                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="border border-red-600 text-red-600 px-4 py-2 rounded"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;

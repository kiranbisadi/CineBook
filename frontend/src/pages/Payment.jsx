import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatDate, getErrorMessage } from "../utils/format";

// Small box that shows the booking details
function BookingSummary({ booking }) {
  const show = booking.showId;

  return (
    <div className="border rounded-lg p-4 mb-6 shadow-sm">
      {show ? (
        <>
          <h2 className="text-xl font-bold">{show.movieId?.title}</h2>

          <p className="text-gray-600 mb-3">
            {show.theatreId?.name}, {show.theatreId?.city} ·{" "}
            {show.screenId?.name}
          </p>

          <p>
            <strong>Date:</strong> {formatDate(show.showDate)}
          </p>
          <p>
            <strong>Time:</strong> {show.startTime}
          </p>
        </>
      ) : (
        <p className="text-gray-600">This show is no longer available.</p>
      )}

      <p>
        <strong>Seats:</strong> {booking.seats.join(", ")}
      </p>
      <p className="text-lg mt-2">
        <strong>Total:</strong> ₹{booking.totalAmount}
      </p>
    </div>
  );
}

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get the booking and the user's payments together
        const [bookingResponse, paymentsResponse] = await Promise.all([
          api.get(`/bookings/${bookingId}`),
          api.get("/payments/my-payments"),
        ]);

        setBooking(bookingResponse.data.booking);

        // Has this booking already been paid?
        const hasPayment = paymentsResponse.data.payments.some(
          (payment) => payment.bookingId && payment.bookingId._id === bookingId
        );

        setAlreadyPaid(hasPayment);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      setError("");

      const response = await api.post(
        "/payments/create-order",
        {
          bookingId,
        }
      );

      const order = response.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Cineverse",

        description: "Movie Ticket Booking",

        order_id: order.id,

        handler: async function (paymentResponse) {
          try {
            await api.post("/payments/verify", {
              bookingId,

              razorpay_order_id:
                paymentResponse.razorpay_order_id,

              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,

              razorpay_signature:
                paymentResponse.razorpay_signature,
            });

            setPaid(true);
          } catch (err) {
            setError(getErrorMessage(err));
          }
        },

        theme: {
          color: "#e50914",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

      razorpay.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!booking) {
    return (
      <div className="text-center mt-10">
        <p className="mb-4">{error || "Booking not found"}</p>
        <Link to="/bookings" className="text-red-600 underline">
          Go to My Bookings
        </Link>
      </div>
    );
  }

  // Cancelled booking: no payment allowed
  if (booking.status === "cancelled") {
    return (
      <div className="max-w-xl mx-auto p-6">
        <BookingSummary booking={booking} />
        <p className="text-red-600 mb-4">
          This booking was cancelled, so payment is not possible.
        </p>
        <Link to="/movies" className="text-red-600 underline">
          Book another movie
        </Link>
      </div>
    );
  }

  // Payment done
  if (paid || alreadyPaid) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          {paid ? "Payment successful! 🎉" : "This booking is already paid"}
        </h1>

        <BookingSummary booking={booking} />

        <button
          onClick={() => navigate("/bookings")}
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          View My Bookings
        </button>
      </div>
    );
  }

  // Payment form
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>

      <BookingSummary booking={booking} />

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">
          Secure Payment
        </h2>

        <p className="text-sm text-gray-500">
          You will be redirected to Razorpay to complete your payment securely.
        </p>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={handlePayment}
        disabled={paying}
        className="bg-red-600 text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {paying ? "Processing..." : `Pay ₹${booking.totalAmount}`}
      </button>
    </div>
  );
}

export default Payment;

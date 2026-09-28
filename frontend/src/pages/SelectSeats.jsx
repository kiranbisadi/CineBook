import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatDate, getErrorMessage } from "../utils/format";

const MAX_SEATS = 6;

function SelectSeats() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  // Change this number to load the seats again
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Show details (movie, theatre, time, price)
        const showsResponse = await api.get("/shows/public");
        const foundShow = showsResponse.data.shows.find(
          (item) => item._id === showId
        );

        setShow(foundShow || null);

        // Seat availability
        if (foundShow) {
          const seatsResponse = await api.get(
            `/bookings/show/${showId}/seats`
          );

          setBookedSeats(seatsResponse.data.bookedSeats);
          setAvailableSeats(seatsResponse.data.availableSeats);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showId, reloadKey]);

  const toggleSeat = (seat) => {
    setError("");

    // Un-select if already selected
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seat));
      return;
    }

    if (selectedSeats.length >= MAX_SEATS) {
      setError(`You can select a maximum of ${MAX_SEATS} seats`);
      return;
    }

    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }

    try {
      setBooking(true);
      setError("");

      const response = await api.post("/bookings", {
        showId,
        seats: selectedSeats,
      });

      // Booking created, now go to the payment page
      navigate(`/payment/${response.data.booking._id}`);
    } catch (err) {
      setError(getErrorMessage(err));

      // Someone else may have taken a seat: reload the seat map
      if (err.response?.status === 400) {
        setSelectedSeats([]);
        setReloadKey((key) => key + 1);
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading seats...</p>;
  }

  if (!show) {
    return (
      <div className="text-center mt-10">
        <p className="mb-4">{error || "Show not found"}</p>
        <Link to="/movies" className="text-red-600 underline">
          Back to movies
        </Link>
      </div>
    );
  }

  // Group all seats by row letter (A1, A2 ... go into row "A")
  const allSeats = [...availableSeats, ...bookedSeats];
  const rows = {};

  allSeats.forEach((seat) => {
    const rowLetter = seat[0];

    if (!rows[rowLetter]) {
      rows[rowLetter] = [];
    }

    rows[rowLetter].push(seat);
  });

  const rowLetters = Object.keys(rows).sort();

  rowLetters.forEach((letter) => {
    rows[letter].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  });

  const totalAmount = selectedSeats.length * show.ticketPrice;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Show details */}
      <h1 className="text-2xl font-bold">{show.movieId?.title}</h1>

      <p className="text-gray-600 mb-6">
        {show.theatreId?.name}, {show.theatreId?.city} · {show.screenId?.name}{" "}
        · {formatDate(show.showDate)} · {show.startTime}
      </p>

      {/* Screen */}
      <div className="bg-gray-300 text-center text-sm text-gray-600 py-1 rounded mb-8">
        SCREEN THIS WAY
      </div>

      {/* Seats */}
      <div className="space-y-2 overflow-x-auto">
        {rowLetters.map((letter) => (
          <div key={letter} className="flex items-center gap-2 justify-center">
            <span className="w-6 text-sm font-semibold text-gray-500">
              {letter}
            </span>

            {rows[letter].map((seat) => {
              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              let seatStyle =
                "bg-white border-gray-400 hover:border-green-600";

              if (isBooked) {
                seatStyle =
                  "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed";
              } else if (isSelected) {
                seatStyle = "bg-green-600 text-white border-green-600";
              }

              return (
                <button
                  key={seat}
                  disabled={isBooked}
                  onClick={() => toggleSeat(seat)}
                  className={`w-10 h-10 text-xs rounded border ${seatStyle}`}
                >
                  {seat.slice(1)}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border border-gray-400 rounded"></span>
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-600 rounded"></span>
          Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-300 rounded"></span>
          Booked
        </span>
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-4 mt-8 shadow-sm">
        {error && <p className="text-red-600 mb-3">{error}</p>}

        {selectedSeats.length === 0 ? (
          <p className="text-gray-600">
            Select up to {MAX_SEATS} seats to continue.
          </p>
        ) : (
          <div>
            <p>
              <strong>Seats:</strong> {selectedSeats.join(", ")}
            </p>
            <p>
              <strong>Total:</strong> ₹{totalAmount}
            </p>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={booking || selectedSeats.length === 0}
          className="mt-4 bg-red-600 text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {booking ? "Booking..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}

export default SelectSeats;

// Temporary frontend data for testing the booking flow.
// Later this will be replaced by real Show API data.

export const mockShows = [
  {
    _id: "show-001",
    movieId: "current-movie",
    showDate: "2026-09-27T00:00:00.000Z",
    startTime: "10:00",
    endTime: "12:30",
    ticketPrice: 200,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },

  {
    _id: "show-002",
    movieId: "current-movie",
    showDate: "2026-09-27T00:00:00.000Z",
    startTime: "14:00",
    endTime: "16:30",
    ticketPrice: 250,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },

  {
    _id: "show-003",
    movieId: "current-movie",
    showDate: "2026-09-27T00:00:00.000Z",
    startTime: "18:00",
    endTime: "20:30",
    ticketPrice: 250,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },

  {
    _id: "show-004",
    movieId: "current-movie",
    showDate: "2026-09-28T00:00:00.000Z",
    startTime: "11:00",
    endTime: "13:30",
    ticketPrice: 200,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },

  {
    _id: "show-005",
    movieId: "current-movie",
    showDate: "2026-09-28T00:00:00.000Z",
    startTime: "19:00",
    endTime: "21:30",
    ticketPrice: 300,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },

  {
    _id: "show-006",
    movieId: "current-movie",
    showDate: "2026-09-29T00:00:00.000Z",
    startTime: "15:00",
    endTime: "17:30",
    ticketPrice: 250,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },

  {
    _id: "show-007",
    movieId: "current-movie",
    showDate: "2026-09-29T00:00:00.000Z",
    startTime: "20:00",
    endTime: "22:30",
    ticketPrice: 300,
    theatreId: {
      _id: "theatre-001",
      name: "Cineverse Cinemas",
      address: "Madhapur",
      city: "Hyderabad",
    },
    screenId: {
      _id: "screen-001",
      name: "Screen 1",
    },
  },
];

export const generateSeats = () => {
  const seats = [];

  for (let row = 0; row < 5; row++) {
    const rowLetter = String.fromCharCode(65 + row);

    for (let seat = 1; seat <= 10; seat++) {
      seats.push(`${rowLetter}${seat}`);
    }
  }

  return seats;
};

export const getMockBookedSeats = (showId) => {
  const bookings = JSON.parse(
    localStorage.getItem("movieBookings") || "[]"
  );

  const bookedSeats = [];

  bookings.forEach((booking) => {
    if (
      booking.showId === showId &&
      booking.status === "confirmed"
    ) {
      bookedSeats.push(...booking.seats);
    }
  });

  return bookedSeats;
};

export const formatShowDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};
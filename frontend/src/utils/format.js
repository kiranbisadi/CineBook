// Show dates are stored in UTC, so we also read them in UTC.
// Example result: "Thu, 1 Oct"
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

// "2026-10-01T00:00:00.000Z"  ->  "2026-10-01"
export const dateKey = (dateString) => dateString.slice(0, 10);

// Today's date on the user's device, as "YYYY-MM-DD"
export const todayKey = () => new Date().toLocaleDateString("en-CA");

// Current time on the user's device, as "HH:MM"
export const nowTime = () => new Date().toTimeString().slice(0, 5);

// Get a readable message from an API error
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

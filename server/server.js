const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory database for demonstration
let reservations = [];

// Helper: Check if two date ranges overlap
const isOverlapping = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Helper: Get difference in months between two dates
const getMonthDifference = (d1, d2) => {
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  );
};

// GET: Retrieve all reservations (for the calendar gray-out and list view)
app.get("/api/reservations", (req, res) => {
  res.json(reservations);
});

// POST: Make a new reservation
app.post("/api/reserve", (req, res) => {
  const { name, email, startDate, endDate } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validation 1: Basic Date Check
  if (start >= end) {
    return res
      .status(400)
      .json({ error: "End date must be after start date." });
  }

  // Validation 2: Max 14 days (Req #4)
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((end - start) / oneDay));
  if (diffDays > 14) {
    return res
      .status(400)
      .json({ error: "Reservations cannot exceed 14 days." });
  }

  // Validation 3: Check Availability (Req #3)
  const hasOverlap = reservations.some((res) => {
    const resStart = new Date(res.startDate);
    const resEnd = new Date(res.endDate);
    return isOverlapping(start, end, resStart, resEnd);
  });

  if (hasOverlap) {
    return res
      .status(400)
      .json({ error: "Selected dates are already booked." });
  }

  // Validation 4: Every Other Month Rule per Customer (Req #4)
  // We check if this specific email has a booking in the current, previous, or next month.
  const userBookings = reservations.filter((r) => r.email === email);
  const violation = userBookings.some((res) => {
    const resStart = new Date(res.startDate);
    const monthDiff = Math.abs(getMonthDifference(start, resStart));
    // If difference is 0 (same month) or 1 (adjacent month), reject.
    // This enforces a "skip a month" gap.
    return monthDiff < 2;
  });

  if (violation) {
    return res
      .status(400)
      .json({ error: "You can only reserve every other month." });
  }

  // Create Reservation
  const newReservation = {
    id: Date.now(),
    name,
    email,
    startDate,
    endDate,
  };

  reservations.push(newReservation);
  res.status(201).json(newReservation);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

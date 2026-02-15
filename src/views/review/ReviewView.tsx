import { useEffect, useState } from "react";
import { Booking, BookingService } from "../../services/BookingService";
import { BookingCard } from "./components/BookingCard";
import "./Review.css";

export const ReviewView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const items = await BookingService.fetchBookings();
        // Sort by date, newest first
        const sortedItems = items.sort(
          (a: Booking, b: Booking) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );
        setBookings(sortedItems);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleConfirmBooking = async (id: string) => {
    try {
      await BookingService.updateBooking(id, "CONFIRMED");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b)),
      );
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <h1>All Reservations</h1>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-review-state">No reservations found.</div>
      ) : (
        <div className="review-list">
          {bookings.map((booking: Booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onConfirm={handleConfirmBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

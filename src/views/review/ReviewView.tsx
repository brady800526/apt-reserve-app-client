import { useEffect, useState } from "react";
import { Reservation, ReservationService } from "../../services/ReservationService";
import { ReservationCard } from "./components/ReservationCard";
import "./Review.css";

export const ReviewView = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "rejected">("pending");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const items = await ReservationService.fetchReservations();
        setReservations(items);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getFilteredReservations = () => {
    const filtered = reservations.filter((reservation) => {
      if (activeTab === "pending") return reservation.status === "CREATED";
      if (activeTab === "confirmed") return reservation.status === "CONFIRMED";
      if (activeTab === "rejected")
        return (
          reservation.status === "CANCELLED" || reservation.status === "REJECTED"
        );
      return false;
    });

    // Sort by date, newest first
    return filtered.sort(
      (a: Reservation, b: Reservation) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
  };

  const handleConfirmReservation = async (id: string) => {
    try {
      await ReservationService.updateReservation(id, "CONFIRMED");
      setReservations((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b)),
      );
    } catch (error) {
      console.error("Error confirming reservation:", error);
    }
  };

  const handleRejectReservation = async (id: string) => {
    try {
      await ReservationService.updateReservation(id, "REJECTED");
      setReservations((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "REJECTED" } : b)),
      );
    } catch (error) {
      console.error("Error rejecting reservation:", error);
    }
  };

  const filteredReservations = getFilteredReservations();

  return (
    <div className="review-container">
      <div className="review-header">
        <h1>All Reservations</h1>
        <div className="review-tabs">
          <button
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`tab-button ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => setActiveTab("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`tab-button ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-review-state">
          No {activeTab} reservations found.
        </div>
      ) : (
        <div className="review-list">
          {filteredReservations.map((reservation: Reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onConfirm={handleConfirmReservation}
              onReject={handleRejectReservation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

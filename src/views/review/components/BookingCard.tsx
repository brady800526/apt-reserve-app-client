
import React from "react";
import { Booking } from "../../../services/BookingService";
import "./BookingCard.css";

interface BookingCardProps {
  booking: Booking;
  onConfirm: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onConfirm }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="booking-card-item">
      <div className="booking-image-container">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
          alt="Apartment"
          className="booking-image"
        />
      </div>
      <div className="booking-content">
        <div className="booking-header">
          <div className="booking-dates">
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </div>
          <div className={`booking-status ${booking.status?.toLowerCase()}`}>
            {booking.status}
          </div>
        </div>
        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Guest</span>
            <span className="detail-value">
              {booking.firstName} {booking.lastName}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{booking.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Guests</span>
            <span className="detail-value">{booking.numberOfPeople}</span>
          </div>
          {booking.totalPrice && (
            <div className="detail-row">
              <span className="detail-label">Total</span>
              <span className="detail-value">${booking.totalPrice}</span>
            </div>
          )}
        </div>
        {booking.status !== "CONFIRMED" && (
          <div className="booking-actions">
            <button
              className="confirm-button"
              onClick={() => onConfirm(booking.id)}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

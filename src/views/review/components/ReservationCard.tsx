
import React from "react";
import { Reservation } from "../../../services/ReservationService";
import "./ReservationCard.css";

interface ReservationCardProps {
  reservation: Reservation;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onConfirm, onReject }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="reservation-card-item">
      <div className="reservation-image-container">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
          alt="Apartment"
          className="reservation-image"
        />
      </div>
      <div className="reservation-content">
        <div className="reservation-header">
          <div className="reservation-dates">
            {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
          </div>
          <div className={`reservation-status ${reservation.status?.toLowerCase()}`}>
            {reservation.status}
          </div>
        </div>
        <div className="reservation-details">
          <div className="detail-row">
            <span className="detail-label">Guest</span>
            <span className="detail-value">
              {reservation.firstName} {reservation.lastName}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{reservation.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Guests</span>
            <span className="detail-value">{reservation.numberOfPeople}</span>
          </div>
          {reservation.totalPrice && (
            <div className="detail-row">
              <span className="detail-label">Total</span>
              <span className="detail-value">${reservation.totalPrice}</span>
            </div>
          )}
        </div>
        {reservation.status === "CREATED" && (
          <div className="reservation-actions">
            <button
              className="reject-button"
              onClick={() => onReject(reservation.id)}
            >
              Reject
            </button>
            <button
              className="confirm-button"
              onClick={() => onConfirm(reservation.id)}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

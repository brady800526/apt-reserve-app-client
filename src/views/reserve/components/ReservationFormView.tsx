import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useReserveViewModel } from "../../../view-models/useReservationViewModel";

type ViewModel = ReturnType<typeof useReserveViewModel>;

export const ReservationFormView = ({
  listing,
  startDate,
  endDate,
  setEndDate,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  numberOfPeople,
  setNumberOfPeople,
  error,
  successMsg,
  handleSubmit,
  calculateNights,
  calculateTotal,
  getBookedDates,
  minCheckoutDate,
  maxCheckoutDate,
  handleStartDateChange,
}: ViewModel) => {
  return (
    <div className="booking-card">
      <div className="card-header">
        <div className="price-tag">
          <strong>${listing?.price}</strong> <span className="light">night</span>
        </div>
        <div className="rating-tag">
          ★ {listing?.rating} ·{" "}
          <span className="underline">{listing?.reviews} reviews</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="booking-inputs">
          <div className="date-row">
            <div className="date-box border-right">
              <label>CHECK-IN</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                excludeDates={getBookedDates()}
                minDate={new Date()}
                className="clean-date-input"
              />
            </div>
            <div className="date-box">
              <label>CHECKOUT</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => date && setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={minCheckoutDate || undefined}
                maxDate={maxCheckoutDate || undefined}
                excludeDates={getBookedDates()}
                className="clean-date-input"
              />
            </div>
          </div>
          <div className="guest-box">
            <label>GUEST INFO</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="clean-text-input"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="clean-text-input"
              style={{ marginTop: "5px" }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="clean-text-input"
              style={{ marginTop: "5px" }}
            />
          </div>
          <div className="guest-box" style={{ borderTop: "1px solid #b0b0b0" }}>
            <label>Number of People</label>
            <div className="guest-selector">
              <button
                type="button"
                className="guest-btn"
                onClick={() =>
                  setNumberOfPeople(Math.max(1, numberOfPeople - 1))
                }
                disabled={numberOfPeople <= 1}
              >
                -
              </button>
              <span className="guest-count">{numberOfPeople}</span>
              <button
                type="button"
                className="guest-btn"
                onClick={() =>
                  setNumberOfPeople(Math.min(2, numberOfPeople + 1))
                }
                disabled={numberOfPeople >= 2}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {successMsg && <div className="success-banner">{successMsg}</div>}

        <button type="submit" className="reserve-btn">
          Reserve
        </button>
      </form>

      <p className="disclaimer">You won't be charged yet</p>

      <div className="price-breakdown">
        <div className="line-item">
          <span>
            ${listing?.price} x {calculateNights() || 1} nights
          </span>
          <span>${calculateTotal()}</span>
        </div>
        <div className="line-item">
          <span>Cleaning fee</span>
          <span>$40</span>
        </div>
        <hr />
        <div className="line-item total">
          <span>Total before taxes</span>
          <span>${calculateTotal() + 40}</span>
        </div>
      </div>
    </div>
  );
};

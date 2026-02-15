import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useBookingViewModel } from "../../../view-models/useBookingViewModel";
import { useUserViewModel } from "../../../view-models/useUserViewModel";

interface BookingFormViewProps {
  bookingViewModel: ReturnType<typeof useBookingViewModel>;
  userViewModel: ReturnType<typeof useUserViewModel>;
}

export const BookingFormView = ({
  bookingViewModel,
  userViewModel,
}: BookingFormViewProps) => {
  const {
    listing,
    error,
    successMsg,
    getBookedDates,
    handleSubmit,
    bookingForm,
    setBookingForm,
    calculateNights,
    calculateTotal,
    minCheckoutDate,
    maxCheckoutDate,
    handleStartDateChange,
  } = bookingViewModel;
  const { user, setUser, validateUser, clearUser } = userViewModel;

  const onFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      numberOfPeople: bookingForm.numberOfPeople,
      validateUser,
      clearUser,
    });
  };

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

      <form onSubmit={onFormSubmit} noValidate>
        <div className="booking-inputs">
          <div className="date-row">
            <div className="date-box border-right">
              <label>CHECK-IN</label>
              <DatePicker
                selected={bookingForm.startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={bookingForm.startDate}
                endDate={bookingForm.endDate}
                excludeDates={getBookedDates ? getBookedDates() : []}
                minDate={new Date()}
                className="clean-date-input"
              />
            </div>
            <div className="date-box">
              <label>CHECKOUT</label>
              <DatePicker
                selected={bookingForm.endDate}
                onChange={(date: Date | null) =>
                  date &&
                  setBookingForm((prev) => ({ ...prev, endDate: date }))
                }
                selectsEnd
                startDate={bookingForm.startDate}
                endDate={bookingForm.endDate}
                minDate={minCheckoutDate || undefined}
                maxDate={maxCheckoutDate || undefined}
                excludeDates={getBookedDates ? getBookedDates() : []}
                className="clean-date-input"
              />
            </div>
          </div>
          <div className="guest-box">
            <label>GUEST INFO</label>
            <input
              type="text"
              value={user.firstName}
              onChange={(e) =>
                setUser((u) => ({ ...u, firstName: e.target.value }))
              }
              placeholder="First Name"
              className="clean-text-input"
            />
            <input
              type="text"
              value={user.lastName}
              onChange={(e) =>
                setUser((u) => ({ ...u, lastName: e.target.value }))
              }
              placeholder="Last Name"
              className="clean-text-input"
              style={{ marginTop: "5px" }}
            />
            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser((u) => ({ ...u, email: e.target.value }))
              }
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
                  setBookingForm((prev) => ({
                    ...prev,
                    numberOfPeople: Math.max(1, prev.numberOfPeople - 1),
                  }))
                }
                disabled={bookingForm.numberOfPeople <= 1}
              >
                -
              </button>
              <span className="guest-count">{bookingForm.numberOfPeople}</span>
              <button
                type="button"
                className="guest-btn"
                onClick={() =>
                  setBookingForm((prev) => ({
                    ...prev,
                    numberOfPeople: Math.min(2, prev.numberOfPeople + 1),
                  }))
                }
                disabled={bookingForm.numberOfPeople >= 2}
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

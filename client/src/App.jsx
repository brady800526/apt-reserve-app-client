import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // TODO: Replace 'localhost' with your computer's IP (e.g., "http://192.168.1.15:5000")
  const API_BASE_URL = "http://localhost:5000";

  // Mock Listing Data
  const listing = {
    title: "Modern Downtown Studio with City Views",
    host: "Brady",
    price: 125,
    rating: 4.92,
    reviews: 128,
    description:
      "Enjoy a stylish experience at this centrally-located place. Perfect for weekend getaways and business trips. Features a modern kitchen, high-speed Wi-Fi, and a stunning view of the city skyline.",
    amenities: [
      "Fast Wifi",
      "Dedicated workspace",
      "Kitchen",
      "Washer/Dryer",
      "Air conditioning",
    ],
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reservations`);
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations", err);
    }
  };

  const getBookedDates = () => {
    let dates = [];
    reservations.forEach((res) => {
      let current = new Date(res.startDate);
      const end = new Date(res.endDate);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * listing.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/reserve`, {
        name,
        email,
        startDate,
        endDate,
      });
      setSuccessMsg("Reserved successfully!");
      fetchReservations();
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar"></header>

      <main className="listing-content">
        {/* Title Section */}
        <section className="listing-header">
          <h1>{listing.title}</h1>
          <div className="listing-meta">
            <span>
              ★ {listing.rating} ·{" "}
              <span className="underline">{listing.reviews} reviews</span>
            </span>
            <span> · Superhost</span>
            <span>
              {" "}
              · <span className="underline">San Francisco, California</span>
            </span>
          </div>
        </section>

        {/* Image Grid Placeholder */}
        <section className="image-grid">
          <div className="main-image"></div>
          <div className="sub-images">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </section>

        <div className="listing-body">
          {/* Left Column: Details */}
          <div className="listing-details">
            <div className="host-info">
              <h2>Entire rental unit hosted by {listing.host}</h2>
              <p>2 guests · 1 bedroom · 1 bed · 1 bath</p>
            </div>
            <hr />
            <div className="description">
              <p>{listing.description}</p>
            </div>
            <hr />
            <div className="amenities">
              <h3>What this place offers</h3>
              <ul>
                {listing.amenities.map((am) => (
                  <li key={am}>{am}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="card-header">
                <div className="price-tag">
                  <strong>${listing.price}</strong>{" "}
                  <span className="light">night</span>
                </div>
                <div className="rating-tag">
                  ★ {listing.rating} ·{" "}
                  <span className="underline">{listing.reviews} reviews</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="booking-inputs">
                  <div className="date-row">
                    <div className="date-box border-right">
                      <label>CHECK-IN</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
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
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        excludeDates={getBookedDates()}
                        className="clean-date-input"
                      />
                    </div>
                  </div>
                  <div className="guest-box">
                    <label>GUEST INFO</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="clean-text-input"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="clean-text-input"
                      style={{ marginTop: "5px" }}
                    />
                  </div>
                </div>

                {error && <div className="error-banner">{error}</div>}
                {successMsg && (
                  <div className="success-banner">{successMsg}</div>
                )}

                <button type="submit" className="reserve-btn">
                  Reserve
                </button>
              </form>

              <p className="disclaimer">You won't be charged yet</p>

              <div className="price-breakdown">
                <div className="line-item">
                  <span>
                    ${listing.price} x {calculateNights() || 1} nights
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

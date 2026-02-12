import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import outputs from "../amplify_outputs.json";
import "./App.css";

Amplify.configure(outputs);

const client = generateClient();

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      const query = `
        query ListReservations {
          listReservations {
            items {
              startDate
              endDate
            }
          }
        }
      `;
      const res = await client.graphql({ query });
      setReservations(res.data.listReservations.items);
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

    if (!firstName || !lastName) {
      setError("Please enter first and last name");
      return;
    }

    if (!email) {
      setError("Please enter email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const mutation = `
        mutation CreateReservation($firstName: String!, $lastName: String!, $email: String!, $startDate: String!, $endDate: String!) {
          createReservation(firstName: $firstName, lastName: $lastName, email: $email, startDate: $startDate, endDate: $endDate) {
            id
          }
        }
      `;
      await client.graphql({
        query: mutation,
        variables: {
          firstName,
          lastName,
          email,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setSuccessMsg("Reserved successfully!");
      fetchReservations();
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Booking failed";
      setError(errorMessage);
    }
  };

  const minCheckoutDate = startDate ? new Date(startDate) : null;
  if (minCheckoutDate) {
    minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
  }

  const maxCheckoutDate = startDate ? new Date(startDate) : null;
  if (maxCheckoutDate) {
    maxCheckoutDate.setDate(maxCheckoutDate.getDate() + 14);
  }

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

              <form onSubmit={handleSubmit} noValidate>
                <div className="booking-inputs">
                  <div className="date-row">
                    <div className="date-box border-right">
                      <label>CHECK-IN</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          const newMaxDate = new Date(date);
                          newMaxDate.setDate(newMaxDate.getDate() + 14);

                          if (date >= endDate) {
                            const newEndDate = new Date(date);
                            newEndDate.setDate(newEndDate.getDate() + 1);
                            setEndDate(newEndDate);
                          } else if (endDate > newMaxDate) {
                            setEndDate(newMaxDate);
                          }
                        }}
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
                        minDate={minCheckoutDate}
                        maxDate={maxCheckoutDate}
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

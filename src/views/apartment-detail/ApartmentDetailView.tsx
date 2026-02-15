import { useBookingViewModel } from "../../view-models/useBookingViewModel";
import { useUserViewModel } from "../../view-models/useUserViewModel";
import { ApartmentImageGridView } from "./components/ApartmentImageGridView";
import { ApartmentListingDetailsView } from "./components/ApartmentListingDetailsView";
import { BookingFormView } from "./components/BookingFormView";

export const ApartmentDetailView = () => {
  // Mock Booking Data
  const booking = {
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
  const bookingViewModel = useBookingViewModel(booking.price, booking);
  const userViewModel = useUserViewModel();

  return (
    <main className="listing-content">
      {/* Title Section */}
      <section className="listing-header">
        <h1>{booking?.title}</h1>
        <div className="listing-meta">
          <span>
            ★ {booking?.rating} ·{" "}
            <span className="underline">{booking?.reviews} reviews</span>
          </span>
          <span> · Superhost</span>
          <span>
            {" "}
            · <span className="underline">San Francisco, California</span>
          </span>
        </div>
      </section>

      <ApartmentImageGridView />

      <div className="listing-body">
        <ApartmentListingDetailsView booking={booking!} />
        <div className="booking-sidebar">
          <BookingFormView
            booking={booking!}
            bookingViewModel={bookingViewModel}
            userViewModel={userViewModel}
          />
        </div>
      </div>
    </main>
  );
};

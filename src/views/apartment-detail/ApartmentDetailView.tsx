import { useReservationViewModel } from "../../view-models/useReservationViewModel";
import { useUserViewModel } from "../../view-models/useUserViewModel";
import { ApartmentImageGridView } from "./components/ApartmentImageGrid";
import { ApartmentListingDetailsView } from "./components/ApartmentListingDetails";
import { ReservationFormView } from "./components/ReservationForm";

export const ApartmentDetailView = () => {
  // Mock Reservation Data
  const reservation = {
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
  const reservationViewModel = useReservationViewModel(reservation.price, reservation);
  const userViewModel = useUserViewModel();

  return (
    <main className="listing-content">
      {/* Title Section */}
      <section className="listing-header">
        <h1>{reservation?.title}</h1>
        <div className="listing-meta">
          <span>
            ★ {reservation?.rating} ·{" "}
            <span className="underline">{reservation?.reviews} reviews</span>
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
        <ApartmentListingDetailsView reservation={reservation!} />
        <div className="reservation-sidebar">
          <ReservationFormView
            reservation={reservation!}
            reservationViewModel={reservationViewModel}
            userViewModel={userViewModel}
          />
        </div>
      </div>
    </main>
  );
};

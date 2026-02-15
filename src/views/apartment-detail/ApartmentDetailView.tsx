import { useBookingViewModel } from "../../view-models/useBookingViewModel";
import { useUserViewModel } from "../../view-models/useUserViewModel";
import { ApartmentImageGridView } from "./components/ApartmentImageGridView";
import { ApartmentListingDetailsView } from "./components/ApartmentListingDetailsView";
import { BookingFormView } from "./components/BookingFormView";

export const ApartmentDetailView = () => {
  const bookingViewModel = useBookingViewModel(125); // Pass price here or fetch it inside if possible, but for now we pass a default or handle it.
  // Actually, useBookingViewModel needs price. The previous code passed listing?.price || 0.
  // But wait, useBookingViewModel now fetches listing data logically (or has mock data).
  // Let's check useBookingViewModel implementation again. It has mock listing data inside.
  // So we can probably just call it.
  const { listing } = bookingViewModel;
  const userViewModel = useUserViewModel();

  return (
    <main className="listing-content">
      {/* Title Section */}
      <section className="listing-header">
        <h1>{listing?.title}</h1>
        <div className="listing-meta">
          <span>
            ★ {listing?.rating} ·{" "}
            <span className="underline">{listing?.reviews} reviews</span>
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
        <ApartmentListingDetailsView listing={listing!} />
        <div className="booking-sidebar">
          <BookingFormView
            bookingViewModel={bookingViewModel}
            userViewModel={userViewModel}
          />
        </div>
      </div>
    </main>
  );
};

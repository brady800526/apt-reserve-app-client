import { useBookingSubmitViewModel } from "../../view-models/useBookingSubmitViewModel";
import { useBookingViewModel } from "../../view-models/useBookingViewModel";
import { useUserViewModel } from "../../view-models/useUserViewModel";
import { ApartmentImageGridView } from "./components/ApartmentImageGridView";
import { ApartmentListingDetailsView } from "./components/ApartmentListingDetailsView";
import { BookingFormView } from "./components/BookingFormView";

export const ApartmentDetailView = () => {
  const bookingSubmitViewModel = useBookingSubmitViewModel();
  const userViewModel = useUserViewModel();
  const { listing } = bookingSubmitViewModel;
  const bookingFormViewModel = useBookingViewModel(listing?.price || 0);

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
            bookingViewModel={bookingSubmitViewModel}
            userViewModel={userViewModel}
            bookingFormViewModel={bookingFormViewModel}
          />
        </div>
      </div>
    </main>
  );
};

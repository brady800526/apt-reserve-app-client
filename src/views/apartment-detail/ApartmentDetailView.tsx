import { useBookingFormViewModel } from "../../view-models/useBookingFormViewModel";
import { useBookingViewModel } from "../../view-models/useBookingViewModel";
import { useUserViewModel } from "../../view-models/useUserViewModel";
import { ApartmentImageGridView } from "./components/ApartmentImageGridView";
import { ApartmentListingDetailsView } from "./components/ApartmentListingDetailsView";
import { BookingFormView } from "./components/BookingFormView";

export const ApartmentDetailView = () => {
  const bookingViewModel = useBookingViewModel();
  const userViewModel = useUserViewModel();
  const { listing } = bookingViewModel;
  const bookingFormViewModel = useBookingFormViewModel(
    listing?.price || 0,
    userViewModel.user,
  );

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
            {...bookingViewModel}
            {...userViewModel}
            {...bookingFormViewModel}
            handleSubmit={(e: React.FormEvent) =>
              bookingViewModel.handleSubmit(e, {
                firstName: userViewModel.user.firstName,
                lastName: userViewModel.user.lastName,
                email: userViewModel.user.email,
                startDate: bookingFormViewModel.bookingForm.startDate,
                endDate: bookingFormViewModel.bookingForm.endDate,
                numberOfPeople: bookingFormViewModel.bookingForm.numberOfPeople,
                validateUser: userViewModel.validateUser,
                clearUser: userViewModel.clearUser,
              })
            }
          />
        </div>
      </div>
    </main>
  );
};

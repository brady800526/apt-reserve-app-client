import { useReserveViewModel } from "../../view-models/useReservationViewModel";
import { ReservationFormView } from "./components/ReservationFormView";
import { ReservationImageGridView } from "./components/ReservationImageGridView";
import { ReservationListingDetailsView } from "./components/ReservationListingDetailsView";

export const ReservationView = () => {
  const viewModel = useReserveViewModel();
  const { listing } = viewModel;

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

      <ReservationImageGridView />

      <div className="listing-body">
        <ReservationListingDetailsView listing={listing!} />
        <div className="booking-sidebar">
          <ReservationFormView {...viewModel} />
        </div>
      </div>
    </main>
  );
};

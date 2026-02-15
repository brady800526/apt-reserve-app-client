interface Listing {
  title: string;
  host: string;
  description: string;
  amenities: string[];
}

interface ApartmentListingDetailsViewProps {
  booking: Listing;
}

export const ApartmentListingDetailsView = ({
  booking,
}: ApartmentListingDetailsViewProps) => {
  return (
    <div className="listing-details">
      <div className="host-info">
        <h2>Hosted by {booking.host}</h2>
        <p>Superhost · 4 years hosting</p>
      </div>

      <div className="divider"></div>

      <div className="description">
        <p>{booking.description}</p>
      </div>

      <div className="divider"></div>

      <div className="amenities">
        <h2>What this place offers</h2>
        <ul className="amenities-list">
          {booking.amenities?.map((amenity: string, index: number) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

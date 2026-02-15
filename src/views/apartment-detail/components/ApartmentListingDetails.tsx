interface Listing {
  title: string;
  host: string;
  description: string;
  amenities: string[];
}

interface ApartmentListingDetailsViewProps {
  reservation: Listing;
}

export const ApartmentListingDetailsView = ({
  reservation,
}: ApartmentListingDetailsViewProps) => {
  return (
    <div className="listing-details">
      <div className="host-info">
        <h2>Hosted by {reservation.host}</h2>
        <p>Superhost · 4 years hosting</p>
      </div>

      <div className="divider"></div>

      <div className="description">
        <p>{reservation.description}</p>
      </div>

      <div className="divider"></div>

      <div className="amenities">
        <h2>What this place offers</h2>
        <ul className="amenities-list">
          {reservation.amenities?.map((amenity: string, index: number) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

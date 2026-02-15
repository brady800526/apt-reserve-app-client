interface Listing {
  title: string;
  host: string;
  description: string;
  amenities: string[];
}

interface ApartmentListingDetailsViewProps {
  listing: Listing;
}

export const ApartmentListingDetailsView = ({
  listing,
}: ApartmentListingDetailsViewProps) => {
  return (
    <div className="listing-details">
      <div className="host-info">
        <h2>Hosted by {listing.host}</h2>
        <p>Superhost · 4 years hosting</p>
      </div>

      <div className="divider"></div>

      <div className="description">
        <p>{listing.description}</p>
      </div>

      <div className="divider"></div>

      <div className="amenities">
        <h2>What this place offers</h2>
        <ul className="amenities-list">
          {listing.amenities?.map((amenity: string, index: number) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

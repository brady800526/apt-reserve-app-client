export const ReservationListingDetailsView = ({ listing }) => {
  return (
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
  );
};

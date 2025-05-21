import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDummyDestinations } from '../data';

function DestinationPage() {
  const { id } = useParams(); // Gets the 'id' from the URL, e.g., /destination/paris -> id = 'paris'
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const destinations = getDummyDestinations();
    const foundDestination = destinations.find(d => d.id === id);
    if (foundDestination) {
      setDestination(foundDestination);
    } else {
      // Handle case where destination is not found (e.g., redirect to 404 or home)
      console.warn(`Destination with ID '${id}' not found.`);
      setDestination(null); // Or set an error state
    }
  }, [id]); // Re-run effect if ID changes in URL

  if (!destination) {
    return (
      <main>
        <section className="destination-detail-section">
          <h2>Destination Not Found</h2>
          <p>The destination you are looking for does not exist or has been removed.</p>
          <Link to="/">Back to Home</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="destination-detail-section">
        <div className="destination-detail-header">
          <img src={destination.picture} alt={destination.name} className="destination-detail-img" />
          <h1>{destination.name}</h1>
          <p className="rating">Rating: {destination.averageRating} ★★★★★</p>
          <p className="category">Category: {destination.category}</p>
        </div>
        <div className="destination-detail-info">
          <h2>About {destination.name}</h2>
          <p>{destination.info}</p>
          {/* Add more details, e.g., reviews, travel tips */}
        </div>
        <Link to="/" className="back-button">Back to All Destinations</Link>
      </section>
    </main>
  );
}

export default DestinationPage;
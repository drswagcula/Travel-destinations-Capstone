// src/pages/DestinationsPage.js
import React, { useEffect, useState } from 'react';
import { getDummyDestinations } from '../data'; // Correctly importing from data.js
import { Link } from 'react-router-dom';
import '../css/style.css';

function DestinationsPage() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This useEffect hook handles fetching destinations once when the component mounts
    useEffect(() => {
        console.log("DestinationsPage: useEffect started.");
        try {
            const loadedDestinations = getDummyDestinations();
            console.log("DestinationsPage: Data fetched from getDummyDestinations():", loadedDestinations);
            if (loadedDestinations && loadedDestinations.length > 0) {
                setDestinations(loadedDestinations);
                console.log("DestinationsPage: Destinations set successfully. Count:", loadedDestinations.length);
            } else {
                setError("No destinations found. Please ensure the database is seeded and localStorage is cleared.");
                console.warn("DestinationsPage: getDummyDestinations returned no data.");
            }
        } catch (err) {
            console.error("DestinationsPage: Failed to load destinations:", err);
            setError("Failed to load destinations. Please try again later.");
        } finally {
            setLoading(false);
            console.log("DestinationsPage: Loading state set to false.");
        }
    }, []); // The empty dependency array ensures this effect runs only once on mount

    // Conditional rendering based on loading, error, or no destinations state
    if (loading) {
        return (
            <main>
                <section className="destination-list-section">
                    <h2>Loading Destinations...</h2>
                    <p>Please wait.</p>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <section className="destination-list-section">
                    <h2 style={{ color: 'red' }}>Error Loading Destinations</h2>
                    <p>{error}</p>
                    <Link to="/">Go to Home</Link>
                </section>
            </main>
        );
    }

    if (destinations.length === 0) {
        return (
            <main>
                <section className="destination-list-section">
                    <h2>No Destinations Available</h2>
                    <p>It seems there are no travel destinations to display at the moment.</p>
                    <Link to="/">Go to Home</Link>
                </section>
            </main>
        );
    }

    // This is the CORRECT AND ONLY main return for the component
    return (
        <main>
            <section className="destination-list-section">
                <h2>All Travel Destinations</h2>
                <div id="destination-list">
                    {destinations.map(destination => (
                        <div className="destination-card" key={destination.id}>
                            <Link to={`/destination/${destination.id}`}>
                                <img src={destination.picture} alt={destination.name} />
                                <div className="card-content">
                                    <h3>{destination.name}</h3>
                                    <p className="category">Category: {destination.category}</p>
                                    <p className="rating">Rating: {destination.averageRating} ★★★★★</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
} // <-- This is the END of the DestinationsPage function

export default DestinationsPage;
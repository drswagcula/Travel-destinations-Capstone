// src/pages/DestinationsPage.js
import React, { useEffect, useState } from 'react';
import { getDummyDestinations } from '../data'; // Ensure path is correct
import { Link } from 'react-router-dom'; // For navigating to individual destination details
import '../css/style.css'; // Import your global CSS for styling

function DestinationsPage() {
    console.log("DestinationsPage component rendered."); // Log on every render

    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("DestinationsPage: useEffect started for data fetching."); // Log when effect runs
        try {
            const loadedDestinations = getDummyDestinations();
            console.log("DestinationsPage: Data fetched from getDummyDestinations():", loadedDestinations);

            if (loadedDestinations && loadedDestinations.length > 0) {
                setDestinations(loadedDestinations);
                console.log("DestinationsPage: Destinations set successfully. Count:", loadedDestinations.length);
            } else {
                setError("No destinations found. Please ensure the database is seeded.");
                console.warn("DestinationsPage: getDummyDestinations returned no data.");
            }
        } catch (err) {
            console.error("DestinationsPage: Failed to load destinations:", err);
            setError("Failed to load destinations. Please try again later.");
        } finally {
            setLoading(false); // Done loading, regardless of success or failure
            console.log("DestinationsPage: Loading state set to false.");
        }
    }, []); // Empty dependency array: runs once on component mount

    console.log("DestinationsPage: Current state - loading:", loading, "error:", error, "destinations count:", destinations.length);

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
                    <Link to="/">Go to Home</Link> {/* Provide a way back */}
                </section>
            </main>
        );
    }

    if (destinations.length === 0) {
        console.log("DestinationsPage: No destinations to display, rendering empty state.");
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

    console.log("DestinationsPage: Rendering destination list.");
    return (
        <main>
            <section className="destination-list-section">
                <h2>All Travel Destinations</h2>
                <div id="destination-list"> {/* This ID maps to your CSS grid */}
                    {destinations.map(destination => (
                        <div className="destination-card" key={destination.id}>
                            {/* Wrap the entire card content in a Link for better UX */}
                            <Link to={`/destination/${destination.id}`}>
                                <img src={destination.picture} alt={destination.name} />
                                <div className="card-content"> {/* Optional: for more structured content inside the card */}
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
}

export default DestinationsPage;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';

function DestinationsPage() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define your backend API URL.
    // IMPORTANT: Replace 5000 with the actual port your backend is running on.
    // Also, ensure the path '/api/destinations' matches your backend route.
    const API_BASE_URL = 'http://localhost:8080/api'; // Assuming your backend serves destinations at /api/destinations

    // This useEffect hook handles fetching destinations from your backend
    useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true); // Start loading
            setError(null);   // Clear any previous errors
            console.log("DestinationsPage: Attempting to fetch destinations from backend...");

            try {
                // Make the GET request to your backend API
                const response = await fetch(`${API_BASE_URL}/destinations`);

                // Check if the response was successful (status code 200-299)
                if (!response.ok) {
                    // If not successful, throw an error with the status
                    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
                }

                // Parse the JSON response
                const data = await response.json();

                console.log("DestinationsPage: Data fetched from backend:", data);

                if (data && data.length > 0) {
                    setDestinations(data);
                    console.log("DestinationsPage: Destinations set successfully. Count:", data.length);
                } else {
                    setError("No destinations found from the server.");
                    console.warn("DestinationsPage: Backend returned no destination data.");
                }
            } catch (err) {
                // Catch any errors during the fetch operation (network issues, API errors)
                console.error("DestinationsPage: Failed to load destinations from backend:", err);
                setError(`Failed to load destinations: ${err.message}. Please check your backend server.`);
            } finally {
                // This block runs regardless of success or failure
                setLoading(false);
                console.log("DestinationsPage: Loading state set to false.");
            }
        };

        fetchDestinations(); // Call the async function
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
                            {/* Make sure your backend data matches these property names (e.g., 'picture' vs 'main_image_url') */}
                            <Link to={`/destination/${destination.id}`}>
                                <img src={destination.main_image_url} alt={destination.name} /> {/* Changed to main_image_url based on your SQL */}
                                <div className="card-content">
                                    <h3>{destination.name}</h3>
                                    <p className="category">Category: {destination.category}</p> {/* Assuming 'category' exists in your backend data */}
                                    <p className="rating">Rating: {destination.averageRating} ★★★★★</p> {/* Assuming 'averageRating' exists or you'll calculate it */}
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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css'; // Make sure this path is correct

function DestinationsPage() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get API_BASE_URL from environment variables for Create React App.
    // It falls back to a default localhost URL for development if not set.
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    // Optional: Log a warning if the API_BASE_URL is still not found, useful during development
    if (!API_BASE_URL) {
      console.warn("DestinationsPage: REACT_APP_API_BASE_URL environment variable is not set. Please check your .env file or build configuration.");
    }

    // This useEffect hook handles fetching destinations from your backend
    useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true); // Start loading
            setError(null);   // Clear any previous errors
            console.log("DestinationsPage: Attempting to fetch destinations from backend...");
            try {
                // Make the GET request to your backend API
                // Ensure your backend serves destinations at /destinations (or /api/destinations if that's how you set up your your main router)
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
                setError(`Failed to load destinations: ${err.message}. Please check your backend server and the API_BASE_URL.`);
            } finally {
                // This block runs regardless of success or failure
                setLoading(false);
                console.log("DestinationsPage: Loading state set to false.");
            }
        };
        fetchDestinations(); // Call the async function
    }, [API_BASE_URL]); // Dependency array: Re-run if API_BASE_URL changes

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
                                {/* ADDED CONSOLE.LOG HERE FOR DEBUGGING */}
                                {console.log("Image URL for", destination.name, ":", destination.main_image_url)}
                                <img src={destination.main_image_url} alt={destination.name} />
                                <div className="card-content">
                                    <h3>{destination.name}</h3>
                                    <p className="category">Category: {destination.category}</p>
                                    <p className="rating">Rating: {destination.averageRating || 'N/A'} ★★★★★</p>
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
import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useLocation, Link } from 'react-router-dom';
// Removed getDummyDestinations as we'll fetch from backend
import '../css/style.css';

function SearchResultsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query');

    // IMPORTANT: Replace with your actual backend URL
    const API_BASE_URL = 'http://localhost:8080/api'; // Assuming your backend runs on port 5000

    // Function to fetch search results from the backend
    const fetchSearchResults = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear any previous errors
        console.log("SearchResultsPage: Fetching results for query:", searchQuery);

        if (!searchQuery) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        try {
            // Adjust the endpoint to match your backend's search API
            // For example, if your backend has an endpoint like /api/destinations/search?q=query
            const response = await fetch(`${API_BASE_URL}/destinations/search?q=${encodeURIComponent(searchQuery)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setSearchResults(data);
            console.log("SearchResultsPage: Fetched search results:", data);
        } catch (err) {
            console.error("SearchResultsPage: Failed to fetch search results:", err);
            setError(`Failed to load search results: ${err.message}`);
            setSearchResults([]); // Clear results on error
        } finally {
            setLoading(false);
            console.log("SearchResultsPage: Loading state set to false.");
        }
    }, [searchQuery]); // Dependency: re-run if searchQuery changes

    // Effect to trigger the fetch when searchQuery changes
    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]); // Dependency: fetchSearchResults (memoized by useCallback)

    return (
        <main>
            <section className="search-results-section">
                <h2>Search Results for "{searchQuery}"</h2>
                {loading ? (
                    <p>Loading results...</p>
                ) : error ? ( // Display error message if there's an error
                    <p style={{ color: 'red' }}>{error}</p>
                ) : searchResults.length > 0 ? (
                    <div id="search-results-list" className="destination-list">
                        {searchResults.map(destination => (
                            <div className="destination-card" key={destination.id}>
                                <Link to={`/destination/${destination.id}`}>
                                    <img src={destination.picture} alt={destination.name} />
                                    <div className="card-content">
                                        <h3>{destination.name}</h3>
                                        <p className="category">Category: {destination.category}</p>
                                        {/* Assuming your backend returns averageRating */}
                                        <p className="rating">Rating: {destination.averageRating || 'N/A'} ★★★★★</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No destinations found matching your search.</p>
                )}
                <p className="back-link-container">
                    <Link to="/destinations">Back to All Destinations</Link>
                </p>
            </section>
        </main>
    );
}

export default SearchResultsPage;
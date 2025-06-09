import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../css/style.css';

function SearchResultsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query');

    const API_BASE_URL = 'http://localhost:8080/api';

    const fetchSearchResults = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log("SearchResultsPage: Fetching results for query:", searchQuery);

        if (!searchQuery) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        try {
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
            setSearchResults([]);
        } finally {
            setLoading(false);
            console.log("SearchResultsPage: Loading state set to false.");
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    return (
        <main>
            <section className="search-results-section">
                <h2>Search Results for "{searchQuery}"</h2>
                {loading ? (
                    <p>Loading results...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : searchResults.length > 0 ? (
                    <div id="search-results-list" className="destination-list">
                        {searchResults.map(destination => (
                            <div className="destination-card" key={destination.id}>
                                <Link to={`/destination/${destination.id}`}>
                                    {/* MODIFIED: Changed destination.picture to destination.main_image_url */}
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
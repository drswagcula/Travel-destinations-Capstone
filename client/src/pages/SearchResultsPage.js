import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getDummyDestinations } from '../data';
import '../css/style.css';

function SearchResultsPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        setLoading(true);
        console.log("SearchResultsPage: useEffect started for query:", searchQuery);

        if (searchQuery) {
            // FIX: Directly chain filter to getDummyDestinations() to avoid 'allDestinations' unused warning
            const allDestinations = getDummyDestinations(); // Keep this if you need to inspect all destinations before filtering
            console.log("SearchResultsPage: All destinations from data:", allDestinations);

            const filteredResults = allDestinations.filter(destination => // Original logic using allDestinations variable
                destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                destination.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                destination.info.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log("SearchResultsPage: Filtered results:", filteredResults);
            setSearchResults(filteredResults);
        } else {
            console.log("SearchResultsPage: No search query provided.");
            setSearchResults([]);
        }
        setLoading(false);
        console.log("SearchResultsPage: Loading state set to false.");
    }, [searchQuery]);

    return (
        <main>
            <section className="search-results-section">
                <h2>Search Results for "{searchQuery}"</h2>
                {loading ? (
                    <p>Loading results...</p>
                ) : searchResults.length > 0 ? (
                    <div id="search-results-list" className="destination-list">
                        {searchResults.map(destination => (
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
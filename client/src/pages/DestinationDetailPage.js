import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDestinationById, getReviewsByDestinationId } from '../data'; // Assuming you'll add these functions to data.js
import '../css/style.css'; // Import your global CSS

function DestinationDetailPage() {
    const { id } = useParams(); // Get the 'id' from the URL
    const [destination, setDestination] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("DestinationDetailPage: useEffect started for ID:", id); // Log when useEffect starts and the ID
        setLoading(true);
        setError(null);
        try {
            const foundDestination = getDestinationById(id); // You need to implement this in data.js
            console.log("DestinationDetailPage: getDestinationById returned:", foundDestination); // Log the found destination

            if (foundDestination) {
                setDestination(foundDestination);
                console.log("DestinationDetailPage: Destination set to:", foundDestination.name);

                const loadedReviews = getReviewsByDestinationId(id); // You need to implement this in data.js
                setReviews(loadedReviews);
                console.log("DestinationDetailPage: Reviews loaded for destination. Count:", loadedReviews.length);

            } else {
                setError("Destination not found.");
                console.warn("DestinationDetailPage: Destination with ID", id, "not found.");
            }
        } catch (err) {
            console.error("DestinationDetailPage: Failed to load destination details for ID:", id, err); // Log the error with ID
            setError("Failed to load destination details. Please try again later.");
        } finally {
            setLoading(false);
            console.log("DestinationDetailPage: Loading state set to false.");
        }
    }, [id]); // Re-run effect if the ID in the URL changes

    if (loading) {
        console.log("DestinationDetailPage: Rendering Loading state."); // Log rendering state
        return (
            <main>
                <section className="destination-detail-section">
                    <h2>Loading Destination...</h2>
                </section>
            </main>
        );
    }

    if (error) {
        console.log("DestinationDetailPage: Rendering Error state. Error:", error); // Log rendering state and error
        return (
            <main>
                <section className="destination-detail-section">
                    <h2 style={{color: 'red'}}>Error: {error}</h2>
                </section>
            </main>
        );
    }

    if (!destination) {
        console.log("DestinationDetailPage: Rendering 'Destination Not Found' state."); // Log rendering state
        return (
            <main>
                <section className="destination-detail-section">
                    <h2>Destination Not Found</h2>
                    <p>The destination you are looking for does not exist.</p>
                </section>
            </main>
        );
    }

    console.log("DestinationDetailPage: Rendering full detail page for:", destination.name); // Log before rendering content
    return (
        <main>
            <section className="destination-detail-section">
                <div className="destination-detail-header">
                    <img src={destination.picture} alt={destination.name} className="detail-image" />
                    <h1>{destination.name}</h1>
                    <p className="category">Category: {destination.category}</p>
                    <p className="rating">Rating: {destination.averageRating} ★★★★★</p>
                </div>
                <div className="destination-detail-info">
                    <p>{destination.info}</p>
                    {/* Add more details here as needed */}
                </div>

                <div id="comment-section">
                    <h3>Reviews ({reviews.length})</h3>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="review">
                                <strong>{review.username}</strong> ({review.rating} ★): {review.comment}
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first to review!</p>
                    )}
                    {/* Add a review form here */}
                    <div id="review-form">
                        <h4>Submit a Review</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="rating">Rating:</label>
                                <select id="rating" className="form-control">
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Comment:</label>
                                <textarea id="comment" rows="4" className="form-control" placeholder="Share your experience..."></textarea>
                            </div>
                            <button type="submit">Submit Review</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default DestinationDetailPage;
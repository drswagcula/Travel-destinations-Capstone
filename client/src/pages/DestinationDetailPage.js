import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useParams, Link } from 'react-router-dom'; // Added Link here
// Removed imports from '../data' as we'll fetch from backend
import '../css/style.css';
import { useAuth } from '../AuthContext'; // To get current user for review submission

function DestinationDetailPage() {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState('5'); // Default to 5 stars
    const [newReviewContent, setNewReviewContent] = useState('');
    const { user, isLoggedIn } = useAuth(); // Get current user for review submission

    // IMPORTANT: Replace with your actual backend URL
    const API_BASE_URL = 'http://localhost:8080/api';

    // Function to fetch destination details
    // Wrap with useCallback to prevent re-creation on every render, which would cause useEffect to re-run
    const fetchDestinationDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log("DestinationDetailPage: Fetching details for ID:", id);
        try {
            // Fetch destination
            const destResponse = await fetch(`${API_BASE_URL}/destinations/${id}`);
            if (!destResponse.ok) {
                if (destResponse.status === 404) {
                    throw new Error("Destination not found.");
                }
                throw new Error(`HTTP error! Status: ${destResponse.status} - ${destResponse.statusText}`);
            }
            const destData = await destResponse.json();
            setDestination(destData);
            console.log("DestinationDetailPage: Fetched destination:", destData);

            // Fetch reviews for this destination
            const reviewsResponse = await fetch(`${API_BASE_URL}/destinations/${id}/reviews`);
            if (!reviewsResponse.ok) {
                throw new Error(`HTTP error fetching reviews! Status: ${reviewsResponse.status} - ${reviewsResponse.statusText}`);
            }
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
            console.log("DestinationDetailPage: Fetched reviews:", reviewsData);

        } catch (err) {
            console.error("DestinationDetailPage: Failed to load destination details:", err);
            setError(`Failed to load destination details: ${err.message}.`);
        } finally {
            setLoading(false);
            console.log("DestinationDetailPage: Loading state set to false.");
        }
    }, [id]); // id is a dependency for useCallback

    // Function to submit a new review
    const handleSubmitReview = async (event) => {
        event.preventDefault();
        if (!isLoggedIn) {
            alert('You must be logged in to submit a review.');
            return;
        }
        if (!newReviewContent.trim()) {
            alert('Review content cannot be empty.');
            return;
        }
        if (!user || !user.id) {
            alert('User information missing. Please log in again.');
            return;
        }

        console.log("DestinationDetailPage: Submitting review...");
        try {
            const token = sessionStorage.getItem('authToken'); // Assuming you store auth token
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '', // Include token for authentication
                },
                body: JSON.stringify({
                    userId: user.id, // Use the actual user ID from AuthContext
                    destinationId: id,
                    rating: parseInt(newReviewRating),
                    content: newReviewContent.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Review submitted successfully!');
                setNewReviewContent(''); // Clear form
                setNewReviewRating('5'); // Reset rating
                fetchDestinationDetails(); // Re-fetch reviews to update the list
            } else {
                alert(data.message || 'Failed to submit review.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Network error or failed to connect to server.');
        }
    };


    useEffect(() => {
        fetchDestinationDetails();
    }, [fetchDestinationDetails]); // Now 'fetchDestinationDetails' is a stable dependency

    if (loading) {
        console.log("DestinationDetailPage: Rendering Loading state.");
        return (
            <main>
                <section className="destination-detail-section">
                    <h2>Loading Destination...</h2>
                </section>
            </main>
        );
    }

    if (error) {
        console.log("DestinationDetailPage: Rendering Error state. Error:", error);
        return (
            <main>
                <section className="destination-detail-section">
                    <h2 style={{ color: 'red' }}>Error: {error}</h2>
                </section>
            </main>
        );
    }

    if (!destination) {
        console.log("DestinationDetailPage: Rendering 'Destination Not Found' state.");
        return (
            <main>
                <section className="destination-detail-section">
                    <h2>Destination Not Found</h2>
                    <p>The destination you are looking for does not exist.</p>
                </section>
            </main>
        );
    }

    console.log("DestinationDetailPage: Rendering full detail page for:", destination.name);
    return (
        <main>
            <section className="destination-detail-section">
                <div className="destination-detail-header">
                    {/* Ensure destination.main_image_url matches your backend's returned field */}
                    <img src={destination.main_image_url} alt={destination.name} className="detail-image" />
                    <h1>{destination.name}</h1>
                    {/* Assuming description, city, country are available from backend */}
                    <p>{destination.description}</p>
                    <p>Location: {destination.city}, {destination.country}</p>
                    {/* averageRating will need to be calculated by backend or derived */}
                    <p className="rating">Rating: {destination.averageRating || 'N/A'} ★★★★★</p>
                </div>
                <div className="destination-detail-info">
                    <p>{destination.info}</p> {/* Assuming 'info' is still a relevant field from backend */}
                </div>

                <div id="comment-section">
                    <h3>Reviews ({reviews.length})</h3>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="review">
                                {/* Assuming review object has username, rating, content */}
                                <strong>{review.username || 'Anonymous'}</strong> ({review.rating} ★): {review.content}
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first to review!</p>
                    )}
                    <div id="review-form">
                        <h4>Submit a Review</h4>
                        {isLoggedIn ? (
                            <form onSubmit={handleSubmitReview}>
                                <div className="form-group">
                                    <label htmlFor="rating">Rating:</label>
                                    <select
                                        id="rating"
                                        className="form-control"
                                        value={newReviewRating}
                                        onChange={(e) => setNewReviewRating(e.target.value)}
                                    >
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="comment">Comment:</label>
                                    <textarea
                                        id="comment"
                                        rows="4"
                                        className="form-control"
                                        placeholder="Share your experience..."
                                        value={newReviewContent}
                                        onChange={(e) => setNewReviewContent(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit">Submit Review</button>
                            </form>
                        ) : (
                            <p>Please <Link to="/login">log in</Link> to submit a review.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default DestinationDetailPage;
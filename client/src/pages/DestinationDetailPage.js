import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/style.css';
import { useAuth } from '../AuthContext';
function DestinationDetailPage() {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState('5');
    const [newReviewContent, setNewReviewContent] = useState('');
    const { user, isLoggedIn } = useAuth();
    const API_BASE_URL = 'http://localhost:8080/api';
    const fetchDestinationDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log("DestinationDetailPage: Fetching details for ID:", id);
        try {
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
    }, [id]);
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
            const token = sessionStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/destinations/${id}/reviews`, { // Corrected URL for review submission
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    // userId: user.id, // Backend routes already extract user ID from token
                    // destinationId: id, // Extracted from URL params on backend
                    rating: parseInt(newReviewRating),
                    content: newReviewContent.trim(),
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Review submitted successfully!');
                setNewReviewContent('');
                setNewReviewRating('5');
                fetchDestinationDetails();
            } else {
                alert(data.error || data.message || 'Failed to submit review.'); // Show error message from backend
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Network error or failed to connect to server.');
        }
    };
    useEffect(() => {
        fetchDestinationDetails();
    }, [fetchDestinationDetails]);
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
                    <img src={destination.main_image_url} alt={destination.name} className="detail-image" />
                    <h1>{destination.name}</h1>
                    <p>{destination.description}</p>
                    {/* THIS IS THE FIX: Access 'name' property of the country object */}
                    <p>Location: {destination.city}, {destination.country ? destination.country.name : 'Unknown Country'}</p>
                    {/* averageRating will need to be calculated by backend or derived */}
                    <p className="rating">Rating: {destination.averageRating || 'N/A'} ★★★★★</p>
                </div>
                <div className="destination-detail-info">
                    {/* Ensure 'info' is a valid property, otherwise remove or adapt */}
                    <p>{destination.info || ''}</p>
                </div>
                <div id="comment-section">
                    <h3>Reviews ({reviews.length})</h3>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="review">
                                {/* Ensure review.user.username is accessed, as backend sends 'user' object with 'username' */}
                                <strong>{review.user?.username || 'Anonymous'}</strong> ({review.rating} ★): {review.content}
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
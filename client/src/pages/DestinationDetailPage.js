import React, { useEffect, useState, useCallback, useRef } from 'react'; // Import useRef
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
    const API_BASE_URL = 'https://travel-destinations-capstone.onrender.com';

    // Ref for the image element
    const heroImageRef = useRef(null);

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
        if (!user || !user.id) { // Ensure user.id is available, though backend typically gets it from token
            alert('User information missing. Please log in again.');
            return;
        }
        console.log("DestinationDetailPage: Submitting review...");
        try {
            const token = sessionStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/destinations/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    rating: parseInt(newReviewRating),
                    content: newReviewContent.trim(),
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Review submitted successfully!');
                setNewReviewContent('');
                setNewReviewRating('5');
                fetchDestinationDetails(); // Re-fetch reviews to update the list
            } else {
                alert(data.error || data.message || 'Failed to submit review.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Network error or failed to connect to server.');
        }
    };

    // Effect for fetching destination details
    useEffect(() => {
        fetchDestinationDetails();
    }, [fetchDestinationDetails]);

    // Effect for the scroll parallax/scale effect on the image
    useEffect(() => {
        const handleScroll = () => {
            if (heroImageRef.current) {
                const scrollY = window.scrollY;
                // Adjust these values to control the effect's intensity
                const scaleFactor = 1 - (scrollY * 0.0003)+ 0.1; // Image scales down faster/slower
                const opacityFactor = 1 - (scrollY * 0.001); // Image fades out faster/slower

                // Apply transformations, ensuring a minimum scale and opacity
                heroImageRef.current.style.transform = `scale(${Math.max(1, scaleFactor)})`;
                heroImageRef.current.style.opacity = `${Math.max(0.5, opacityFactor)}`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener when the component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

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
            <div className="destination-detail-container"> {/* New wrapper for the whole page content */}
                <div className="hero-image-wrapper">
                    {/* Add ref to the image and assign className as destination-hero-image */}
                    <img
                        src={destination.main_image_url}
                        alt={destination.name}
                        className="destination-hero-image"
                        ref={heroImageRef}
                    />
                </div>

                <div className="destination-content-wrapper"> {/* New wrapper for main content */}
                    <section className="destination-info-section">
                        <h1>{destination.name}</h1>
                        <p>{destination.description}</p>
                        <p>Location: {destination.city}, {destination.country ? destination.country.name : 'Unknown Country'}</p>
                        <p className="rating">Rating: {destination.averageRating ? destination.averageRating.toFixed(1) : 'N/A'} ★★★★★</p>
                        {/* If you have a specific 'info' property that's not 'description', keep this */}
                        {/* <p>{destination.info || ''}</p> */}
                    </section>

                    <section id="review-section">
                        <h2>Reviews ({reviews.length})</h2>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="review">
                                    <strong>{review.user?.username || 'Anonymous'}</strong> ({review.rating} ★): {review.content}
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}

                        <div id="review-form"> {/* This div was originally 'comment-section' in your old JSX, changed to 'review-form' based on content */}
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
                                        <label htmlFor="review-content">Your Review:</label> {/* Changed id to review-content */}
                                        <textarea
                                            id="review-content" // Changed id to review-content
                                            rows="4"
                                            className="form-control"
                                            placeholder="Share your experience..."
                                            value={newReviewContent}
                                            onChange={(e) => setNewReviewContent(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit Review</button>
                                </form>
                            ) : (
                                <p>Please <Link to="/login">log in</Link> to submit a review.</p>
                            )}
                        </div>
                    </section>

                    {/* Assuming you want a separate comments section, if not, remove this block */}
                    {/* If comments are part of reviews, you might not need a separate section */}
                    <section id="comment-section"> {/* Retained if separate comment functionality is intended */}
                        <h2>Comments (Coming Soon!)</h2>
                        <p>This section is for general comments, distinct from reviews.</p>
                        {/* Add comment form and display comments here if your API supports them separately */}
                    </section>

                    <p className="back-link-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to="/destinations" className="btn btn-secondary">Back to All Destinations</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default DestinationDetailPage;
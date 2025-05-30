import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import '../css/style.css';

function ProfilePage() {
    const { user, updateUser, isLoggedIn } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);

    const API_BASE_URL = 'http://localhost:8080/api';

    useEffect(() => {
        if (user) {
            setEditableUser({ ...user });
        }
    }, [user]);

    const fetchUserReviews = useCallback(async () => {
        if (!user || !user.id) {
            setLoadingReviews(false);
            return;
        }
        setLoadingReviews(true);
        setReviewsError(null);
        console.log("ProfilePage: Fetching reviews for user ID:", user.id);
        try {
            const token = sessionStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/users/${user.id}/reviews`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setUserReviews(data);
            console.log("ProfilePage: Fetched user reviews:", data);
        } catch (err) {
            console.error("ProfilePage: Failed to fetch user reviews:", err);
            setReviewsError(`Failed to load your reviews: ${err.message}`);
        } finally {
            setLoadingReviews(false);
        }
    }, [user]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserReviews();
        } else {
            setUserReviews([]);
            setLoadingReviews(false);
        }
    }, [isLoggedIn, fetchUserReviews]);

    if (!user) {
        return <p>Please log in to view your profile.</p>;
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (editableUser) {
            console.log("ProfilePage: Saving profile for user:", editableUser.id);
            const result = await updateUser(editableUser);
            if (result.success) {
                alert(result.message);
                setIsEditing(false);
            } else {
                alert(result.message);
            }
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            console.log("ProfilePage: Deleting review ID:", reviewId);
            try {
                const token = sessionStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete review.');
                }

                alert('Review deleted successfully!');
                fetchUserReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
                alert(`Error deleting review: ${error.message}`);
            }
        }
    };

    // Removed handleDeleteComment as it was unused and marked by ESLint

    return (
        <section className="profile-section" id="user-profile">
            <h2 style={{ marginBottom: '20px' }}>Hello, {user.username || user.email}!</h2>

            {editableUser && (
                <>
                    {isEditing ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={editableUser.username || ''}
                                    onChange={handleEditChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editableUser.email || ''}
                                    onChange={handleEditChange}
                                    className="form-control"
                                    disabled
                                />
                            </div>
                            <button onClick={handleSaveProfile} className="btn btn-primary">Save Profile</button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Username:</strong> {user.username || 'N/A'}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <button onClick={() => setIsEditing(true)} className="btn btn-primary edit-profile-btn">Edit Profile</button>
                        </>
                    )}

                    <h3 style={{ marginTop: '30px' }}>My Reviews</h3>
                    {loadingReviews ? (
                        <p>Loading your reviews...</p>
                    ) : reviewsError ? (
                        <p style={{ color: 'red' }}>{reviewsError}</p>
                    ) : userReviews.length > 0 ? (
                        userReviews.map(review => (
                            <div key={review.id} className="user-review">
                                <span>
                                    <strong>{review.destination_name || 'Unknown Destination'}:</strong> {review.rating} Stars - "{review.content}"
                                </span>
                                <button onClick={() => handleDeleteReview(review.id)} className="btn btn-danger">Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}

                    {/* Removed the "My Comments (Placeholder)" section and handleDeleteComment function */}
                </>
            )}
        </section>
    );
}

export default ProfilePage;
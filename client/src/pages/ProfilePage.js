import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getDummyUsers, setDummyUsers } from '../data'; // Assuming you manage reviews/comments via dummy users or separate functions

function ProfilePage() {
  const { user, updateUser } = useAuth(); // Assuming updateUser exists in AuthContext
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(null); // State for editing user data

  useEffect(() => {
    if (user) {
      setEditableUser({ ...user });
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Logic to save updated user data to localStorage/backend
    if (editableUser) {
      const allUsers = getDummyUsers();
      const updatedUsers = allUsers.map(u => u.id === editableUser.id ? editableUser : u);
      setDummyUsers(updatedUsers);
      updateUser(editableUser); // Update user in AuthContext
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      // Logic to delete review from dummy data or backend
      // This is a placeholder. You'll need actual review data and management.
      alert(`Review ${reviewId} deleted.`);
      // Update user's reviews, if they are stored on the user object
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      // Logic to delete comment from dummy data or backend
      alert(`Comment ${commentId} deleted.`);
      // Update user's comments, if they are stored on the user object
    }
  };

  // Dummy reviews/comments for display
  const dummyReviews = [
    { id: 'rev1', destination: 'Paris, France', rating: 5, text: 'Amazing city! Loved every moment.' },
    { id: 'rev2', destination: 'Tokyo, Japan', rating: 4, text: 'Great food, a bit crowded though.' },
  ];
  const dummyComments = [
    { id: 'com1', destination: 'Machu Picchu, Peru', text: 'Want to go here next!' },
    { id: 'com2', destination: 'Bali, Indonesia', text: 'Is it really that relaxing?' },
  ];


  return (
    <section className="profile-section" id="user-profile"> {/* Added profile-section */}
      <h2>User Profile</h2>
      {editableUser && (
        <>
          {isEditing ? (
            <>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editableUser.name || ''}
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
                  disabled // Email usually not editable directly
                />
              </div>
              {/* Add more fields if needed, like role, if editable */}
              <button onClick={handleSaveProfile} className="btn btn-primary">Save Profile</button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Total Reviews:</strong> {user.reviewCount || 0}</p>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary edit-profile-btn">Edit Profile</button>
            </>
          )}

          <h3 style={{ marginTop: '30px' }}>My Reviews</h3>
          {dummyReviews.length > 0 ? (
            dummyReviews.map(review => (
              <div key={review.id} className="user-review">
                <span>
                  <strong>{review.destination}:</strong> {review.rating} Stars - "{review.text}"
                </span>
                <button onClick={() => handleDeleteReview(review.id)} className="btn btn-secondary">Delete</button> {/* Used btn-secondary for deletion */}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          <h3 style={{ marginTop: '30px' }}>My Comments</h3>
          {dummyComments.length > 0 ? (
            dummyComments.map(comment => (
              <div key={comment.id} className="user-comment">
                <span>
                  <strong>{comment.destination}:</strong> "{comment.text}"
                </span>
                <button onClick={() => handleDeleteComment(comment.id)} className="btn btn-secondary">Delete</button> {/* Used btn-secondary for deletion */}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </>
      )}
    </section>
  );
}

export default ProfilePage;
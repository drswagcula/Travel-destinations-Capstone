import React, { useState, useEffect } from 'react';
// Assuming reviews are stored separately or within destinations/users in your data.js
// For this example, let's mock them as if retrieved from data.js
import { getDummyDestinations, setDummyDestinations } from '../../data'; // Just for context, not directly managing reviews here

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch reviews/comments from a backend
    // For now, let's use some dummy data for demonstration
    const allDestinations = getDummyDestinations();
    const mockReviews = [];
    const mockComments = [];

    // Example of flattening reviews/comments if they were nested in destinations
    allDestinations.forEach(dest => {
        // Assuming each dest might have a 'reviews' and 'comments' array
        // This is illustrative, you'd adjust based on your actual data structure
        if (dest.reviews) {
            dest.reviews.forEach(review => mockReviews.push({ ...review, destinationName: dest.name }));
        }
        if (dest.comments) {
            dest.comments.forEach(comment => mockComments.push({ ...comment, destinationName: dest.name }));
        }
    });

    // If you have separate getDummyReviews/getDummyComments functions, use those.
    // For this example, let's just create some fixed dummy ones.
    if (mockReviews.length === 0 && mockComments.length === 0) {
        setReviews([
            { id: 'rev1', destinationName: 'Paris, France', userId: 'user2', rating: 5, text: 'Absolutely breathtaking! A must-visit.', status: 'approved' },
            { id: 'rev2', destinationName: 'Tokyo, Japan', userId: 'john.smith@example.com', rating: 4, text: 'Vibrant city, but very crowded.', status: 'pending' },
        ]);
        setComments([
            { id: 'com1', destinationName: 'Machu Picchu, Peru', userId: 'kuma', text: 'Stunning place! Photos do not do it justice.', status: 'approved' },
            { id: 'com2', destinationName: 'Bali, Indonesia', userId: 'alice.w@example.com', text: 'Planning a trip soon!', status: 'pending' },
        ]);
    } else {
        setReviews(mockReviews);
        setComments(mockComments);
    }
  }, []);

  const handleApprove = (id, type) => {
    if (type === 'review') {
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      alert(`Review ${id} approved.`);
    } else if (type === 'comment') {
      setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c));
      alert(`Comment ${id} approved.`);
    }
    // In a real app, you'd update your backend/localStorage here
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'review') {
        setReviews(reviews.filter(r => r.id !== id));
      } else if (type === 'comment') {
        setComments(comments.filter(c => c.id !== id));
      }
      alert(`${type} ${id} deleted.`);
      // In a real app, you'd update your backend/localStorage here
    }
  };

  return (
    <section className="admin-panel-section">
      <h2>Manage Reviews & Comments</h2>

      <h3>Reviews</h3>
      <div className="admin-list-grid">
        {reviews.length === 0 ? (
          <p>No reviews to display.</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="admin-item-card">
              <h3>Review for {review.destinationName}</h3>
              <p>By: {review.userId}</p>
              <p>Rating: {review.rating} Stars</p>
              <p>"{review.text}"</p>
              <p>Status: <span style={{ color: review.status === 'pending' ? 'orange' : 'green' }}>{review.status}</span></p>
              <div className="admin-item-actions">
                {review.status === 'pending' && (
                  <button onClick={() => handleApprove(review.id, 'review')} className="btn btn-primary">Approve</button>
                )}
                <button onClick={() => handleDelete(review.id, 'review')} className="btn btn-danger delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 style={{ marginTop: '30px' }}>Comments</h3>
      <div className="admin-list-grid">
        {comments.length === 0 ? (
          <p>No comments to display.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="admin-item-card">
              <h3>Comment for {comment.destinationName}</h3>
              <p>By: {comment.userId}</p>
              <p>"{comment.text}"</p>
              <p>Status: <span style={{ color: comment.status === 'pending' ? 'orange' : 'green' }}>{comment.status}</span></p>
              <div className="admin-item-actions">
                {comment.status === 'pending' && (
                  <button onClick={() => handleApprove(comment.id, 'comment')} className="btn btn-primary">Approve</button>
                )}
                <button onClick={() => handleDelete(comment.id, 'comment')} className="btn btn-danger delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminReviews;
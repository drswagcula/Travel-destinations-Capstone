import React, { useState, useEffect } from 'react';
import '../../src/css/style.css'; // Ensure CSS is imported for modal styles

function AdminEditDestinationModal({ isOpen, onClose, destination, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    picture: '',
    averageRating: '',
    info: ''
  });

  useEffect(() => {
    if (destination) {
      setFormData(destination);
    } else {
      setFormData({
        id: '',
        name: '',
        category: '',
        picture: '',
        averageRating: '',
        info: ''
      });
    }
  }, [destination]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{destination ? 'Edit Destination' : 'Add New Destination'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category:</label>
            <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="picture" className="form-label">Picture URL:</label>
            <input type="url" id="picture" name="picture" value={formData.picture} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="averageRating" className="form-label">Average Rating:</label>
            <input type="number" id="averageRating" name="averageRating" value={formData.averageRating} onChange={handleChange} className="form-control" step="0.1" min="0" max="5" required />
          </div>
          <div className="form-group">
            <label htmlFor="info" className="form-label">Info:</label>
            <textarea id="info" name="info" value={formData.info} onChange={handleChange} className="form-control" rows="5" required></textarea>
          </div>
          <button type="submit" className="btn btn-primary login-button">Save</button> {/* modal-content button.login-button uses this */}
        </form>
      </div>
    </div>
  );
}

export default AdminEditDestinationModal;
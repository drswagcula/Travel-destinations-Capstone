import React, { useState, useEffect } from 'react';
import { generateUniqueId } from '../data'; // Use your data utilities

function ItemModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    picture: '',
    averageRating: 4.0,
    info: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: generateUniqueId(), // Generate a new ID for new items
        name: '',
        category: '',
        picture: '',
        averageRating: 4.0,
        info: '',
      });
    }
  }, [isOpen, initialData]); // Reset form when modal opens or initialData changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'averageRating' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.category || !formData.picture) {
      alert('Name, Category, Picture, and ID are required!');
      return;
    }
    onSave(formData);
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{initialData ? 'Edit Destination' : 'Add New Destination'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">ID (Unique Identifier):</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              readOnly={!!initialData} // Readonly if editing existing item
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category/Tags (e.g., European City, Romantic):</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="picture">Picture URL:</label>
            <input
              type="url"
              id="picture"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              placeholder="http://example.com/image.jpg"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="averageRating">Average Rating (1.0-5.0):</label>
            <input
              type="number"
              id="averageRating"
              name="averageRating"
              step="0.1"
              min="1"
              max="5"
              value={formData.averageRating}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="info">Information:</label>
            <textarea
              id="info"
              name="info"
              rows="4"
              value={formData.info}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="login-button">Save Destination</button>
        </form>
      </div>
    </div>
  );
}

export default ItemModal;
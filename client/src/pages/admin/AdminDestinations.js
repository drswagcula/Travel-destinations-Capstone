import React, { useState, useEffect } from 'react';
import { getDummyDestinations, setDummyDestinations, generateUniqueId } from '../../data';
import AdminEditDestinationModal from '../../components/AdminEditDestinationModal'; // Assuming a modal component

function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(null);

  useEffect(() => {
    setDestinations(getDummyDestinations());
  }, []);

  const handleEdit = (destination) => {
    setCurrentDestination(destination);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      const updatedDestinations = destinations.filter(d => d.id !== id);
      setDummyDestinations(updatedDestinations);
      setDestinations(updatedDestinations);
      alert('Destination deleted successfully!');
    }
  };

  const handleSave = (updatedDestination) => {
    if (currentDestination) { // Editing existing
      const updatedList = destinations.map(d => d.id === updatedDestination.id ? updatedDestination : d);
      setDummyDestinations(updatedList);
      setDestinations(updatedList);
    } else { // Adding new
      const newDest = { ...updatedDestination, id: generateUniqueId() };
      const updatedList = [...destinations, newDest];
      setDummyDestinations(updatedList);
      setDestinations(updatedList);
    }
    setIsModalOpen(false);
    setCurrentDestination(null);
  };

  const handleAddClick = () => {
    setCurrentDestination(null); // Clear previous selection for "Add New"
    setIsModalOpen(true);
  };

  return (
    <section className="admin-panel-section">
      <h2>Manage Destinations</h2>
      <button onClick={handleAddClick} className="btn btn-success add-new-btn">Add New Destination</button> {/* Added btn btn-success */}
      <div className="admin-list-grid">
        {destinations.map(dest => (
          <div key={dest.id} className="admin-item-card">
            <img src={dest.picture} alt={dest.name} />
            <h3>{dest.name}</h3>
            <p>Category: {dest.category}</p>
            <p>Rating: {dest.averageRating}</p>
            <div className="admin-item-actions">
              <button onClick={() => handleEdit(dest)} className="btn btn-primary">Edit</button> {/* Added btn btn-primary */}
              <button onClick={() => handleDelete(dest.id)} className="btn btn-danger delete-btn">Delete</button> {/* Added btn btn-danger */}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AdminEditDestinationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          destination={currentDestination}
          onSave={handleSave}
        />
      )}
    </section>
  );
}

export default AdminDestinations;
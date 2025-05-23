import React, { useState, useEffect } from 'react';
import { getDummyDestinations, setDummyDestinations, generateUniqueId } from '../../data';
import ItemModal from '../../components/ItemModal';

function AdminItemsPage() {
  const [destinations, setDestinations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Item being edited

  useEffect(() => {
    // Load initial data on component mount
    setDestinations(getDummyDestinations());
  }, []);

  const handleOpenAddModal = () => {
    setCurrentItem(null); // Clear previous data for new item
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSaveItem = (formData) => {
    let updatedDestinations;
    const existingIndex = destinations.findIndex(d => d.id === formData.id);

    if (existingIndex > -1) {
      // Update existing item
      updatedDestinations = destinations.map(d =>
        d.id === formData.id ? { ...d, ...formData } : d
      );
    } else {
      // Add new item
      updatedDestinations = [...destinations, { ...formData, id: generateUniqueId() }];
    }
    setDestinations(updatedDestinations);
    setDummyDestinations(updatedDestinations); // Update localStorage
  };

  const handleDeleteItem = (id) => {
    if (window.confirm(`Are you sure you want to delete destination with ID: ${id}?`)) {
      const updatedDestinations = destinations.filter(d => d.id !== id);
      setDestinations(updatedDestinations);
      setDummyDestinations(updatedDestinations); // Update localStorage
    }
  };

  return (
    <main className="admin-main-content">
      <section className="admin-panel-section">
        <h2>Manage Destinations</h2>
        <button className="add-new-btn" onClick={handleOpenAddModal}>Add New Destination</button>

        <div id="adminDestinationList" className="admin-list-grid">
          {destinations.map(dest => (
            <div className="admin-item-card" key={dest.id}>
              <img src={dest.picture} alt={dest.name} />
              <div>
                <h3>{dest.name}</h3>
                <p><strong>ID:</strong> {dest.id}</p>
                <p><strong>Category:</strong> {dest.category}</p>
                <p><strong>Rating:</strong> {dest.averageRating}</p>
                <p>{dest.info ? dest.info.substring(0, 100) + '...' : ''}</p>
              </div>
              <div className="admin-item-actions">
                <button onClick={() => handleOpenEditModal(dest)}>Edit</button>
                <button onClick={() => handleDeleteItem(dest.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        initialData={currentItem}
      />
    </main>
  );
}

export default AdminItemsPage;
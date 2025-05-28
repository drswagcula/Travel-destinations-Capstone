// Example: src/components/SearchBar.js (or directly in your Header component)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault(); // Prevent default form submission if it's a form

        if (searchTerm.trim()) { // Only navigate if search term is not empty
            console.log("SearchBar: Navigating to search with query:", searchTerm);
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(''); // Clear the input after search
        } else {
            // Optional: Provide user feedback if search term is empty
            alert('Please enter a search term!');
        }
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search destinations"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
}

export default SearchBar;
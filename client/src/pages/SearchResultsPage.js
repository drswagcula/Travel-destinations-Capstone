// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import Link for navigation
import '../css/style.css'; // Make sure your CSS is imported

// Dummy Destination Data (You could move this to a separate data.js file if preferred)
const allDummyDestinations = [
  { id: 'paris', name: 'Paris, France', description: 'The City of Love, famous for the Eiffel Tower and Louvre Museum. Romantic and historic.' },
  { id: 'rome', name: 'Rome, Italy', description: 'Ancient city with historical coliseums, delicious pasta, and rich history.' },
  { id: 'tokyo', name: 'Tokyo, Japan', description: 'A vibrant metropolis blending traditional culture with futuristic technology. Great food and neon lights.' },
  { id: 'london', name: 'London, UK', description: 'Historic capital with Big Ben, Buckingham Palace, and diverse culture. A global hub.' },
  { id: 'newyork', name: 'New York City, USA', description: 'The Big Apple, known for Times Square, Broadway, Central Park, and iconic skyline.' },
  { id: 'sydney', name: 'Sydney, Australia', description: 'Coastal city famous for its Opera House and Harbour Bridge. Beautiful beaches and outdoor life.' },
  { id: 'rio', name: 'Rio de Janeiro, Brazil', description: 'Known for its lively Carnival, stunning beaches (Copacabana), and Christ the Redeemer statue.' },
  { id: 'barcelona', name: 'Barcelona, Spain', description: 'Gaudi architecture, vibrant street life, beautiful beaches, and delicious tapas.' },
  { id: 'amsterdam', name: 'Amsterdam, Netherlands', description: 'Canals, artistic heritage, elaborate canal houses, and cycling culture. Relaxing vibe.' },
  { id: 'cairo', name: 'Cairo, Egypt', description: 'Home to the Great Pyramids of Giza, ancient history, and bustling bazaars.' },
  { id: 'dubai', name: 'Dubai, UAE', description: 'Luxurious modern city with towering skyscrapers, world-class shopping, and desert safaris.' },
  { id: 'losangeles', name: 'Los Angeles, USA', description: 'City of Angels, famous for Hollywood, sunny beaches, and entertainment industry.' },
  { id: 'berlin', name: 'Berlin, Germany', description: 'Rich history, vibrant art scene, and iconic landmarks like the Brandenburg Gate. Modern and historical.' },
  { id: 'kyoto', name: 'Kyoto, Japan', description: 'Ancient capital known for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.'},
  { id: 'bali', name: 'Bali, Indonesia', description: 'Volcanic mountains, coral reefs, beaches, and rice paddies. Known for its spiritual retreats.'},
  { id: 'parisbeach', name: 'Paris Beach, USA', description: 'A small coastal town in the US, known for its serene beaches, not related to Paris, France.'},
];


function SearchResultsPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    setSearchTerm(query || '');

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredDestinations = allDummyDestinations.filter(dest =>
        // Check if query matches name or description (case-insensitive)
        dest.name.toLowerCase().includes(lowerCaseQuery) ||
        dest.description.toLowerCase().includes(lowerCaseQuery)
      );
      setResults(filteredDestinations);
    } else {
      setResults([]);
    }
  }, [location.search]); // Re-run effect when URL search params change

  return (
    <section className="search-results-section">
      <div className="container">
        <h2>Search Results for "{searchTerm}"</h2>
        {results.length > 0 ? (
          <div className="results-list">
            {results.map(item => (
              <div key={item.id} className="result-item">
                {/* Link to the specific destination page */}
                <Link to={`/destination/${item.id}`}>
                  <h3>{item.name}</h3>
                </Link>
                <p>{item.description}</p>
                {/* You can add more details or an image here */}
              </div>
            ))}
          </div>
        ) : (
          <p>No results found for "{searchTerm}". Try searching for cities like "Paris", "London", "Tokyo", or keywords like "ancient", "beach", "culture".</p>
        )}
      </div>
    </section>
  );
}

export default SearchResultsPage;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/style.css';
import { seedDatabase } from './data'; // <-- Make sure this import is present!

// Call seedDatabase BEFORE rendering your App
seedDatabase();
console.log('Database seeding initiated.'); // For debugging: Check your browser console

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
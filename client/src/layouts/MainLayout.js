import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="app-main-content"> {/* Added a specific class for styling */}
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
import React from 'react';
import { Outlet } from 'react-router-dom'; // <--- ADD THIS IMPORT BACK
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/style.css'; // Make sure your global styles are imported here too, if needed for layout

function AuthPageLayout() { // No need for { children } prop here when using Outlet
  return (
    <>
      <Header />
      <main className="auth-page-main"> {/* Added a specific class for styling */}
        <Outlet /> {/* <--- RENDER THE OUTLET HERE */}
      </main>
      <Footer />
    </>
  );
}

export default AuthPageLayout;
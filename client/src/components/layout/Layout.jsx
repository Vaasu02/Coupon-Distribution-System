import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1>Coupon Distribution System</h1>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Coupon Distribution System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
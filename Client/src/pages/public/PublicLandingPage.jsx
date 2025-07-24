import React from 'react';
import { Link } from 'react-router-dom';

const PublicLandingPage = () => {
  return (
    <div className="public-landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Mealy!</h1>
          <p>Your daily dose of delicious, fresh meals delivered to your door.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="hero-button">Get Started</Link>
            <Link to="/login" className="hero-button secondary">Already a member? Login</Link>
          </div>
          <p className="guest-link-text">
            <Link to="/menu">Explore Today's Menu (as Guest)</Link>
          </p>
        </div>
        <div className="hero-background-overlay"></div>
      </div>
      <div className="container section-padding">
        <h2>About Mealy</h2>
        <p>Mealy connects you with local caterers offering a wide variety of daily menus. Whether you're looking for a quick lunch or a family dinner, we've got you covered.</p>
        <p>Explore daily specials, manage your orders, and enjoy hassle-free meal delivery straight to your door.</p>
      </div>
    </div>
  );
};

export default PublicLandingPage;
import React from 'react';
import { Link } from 'react-router-dom';

const PublicLandingPage = () => {
  return (
    <div className="public-landing-page">
      <section className="hero-section">
        <div className="hero-background-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Mealy!</h1>
          <p>Your daily dose of delicious, fresh meals delivered right to your door.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="hero-button">Get Started</Link>
            <Link to="/login" className="hero-button secondary">Already a member? Login</Link>
          </div>
          <p className="guest-link-text">
            <Link to="/menu">Explore Today's Menu (as Guest)</Link>
          </p>
        </div>
      </section>

      <section className="features-section section-padding">
        <div className="container">
          <h2 className="section-title">Why Choose Mealy?</h2>
          <p className="section-description">
            Experience the convenience and joy of healthy, chef-prepared meals.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">🍽️</span> 
              <h3>Fresh & Delicious</h3>
              <p>Our meals are prepared daily with the freshest local ingredients for unbeatable taste.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚚</span> 
              <h3>Convenient Delivery</h3>
              <p>Get your meals delivered right to your home or office, saving you time and effort.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🥗</span> 
              <h3>Healthy & Balanced</h3>
              <p>Enjoy nutritious options crafted by culinary experts to fit your lifestyle.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌎</span> 
              <h3>Variety of Options</h3>
              <p>From international cuisines to comfort food, there's always something new to try.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section section-padding">
        <div className="how-it-works-background-overlay"></div>
        <div className="container">
          <h2 className="section-title light-text">How Mealy Works</h2>
          <p className="section-description light-text">
            Simple steps to delicious meals delivered to you.
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Browse Menu</h3>
              <p>Check out our daily changing menu featuring a variety of meals.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Place Your Order</h3>
              <p>Select your favorite meals and customize your order with ease.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Enjoy Delivery</h3>
              <p>Sit back and relax as your fresh, hot meal is delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section section-padding">
        <div className="cta-background-overlay"></div>
        <div className="container cta-content">
          <h2 className="section-title light-text">Ready to Taste the Difference?</h2>
          <p className="section-description light-text">
            Join Mealy today and transform your mealtime experience.
          </p>
          <Link to="/signup" className="hero-button">Sign Up Now!</Link>
        </div>
      </section>

    </div>
  );
};

export default PublicLandingPage;
import React from 'react';
import { Link } from 'react-router-dom';

const PublicLandingPage = () => {
  return (
    <div>
      <div>
        <h1>Welcome to Mealy!</h1>
        <p>Your daily dose of delicious, fresh meals delivered to your door.</p>
        <div>
          <Link to="/signup">Get Started</Link>
          <Link to="/login">Already a member? Login</Link>
        </div>
        <p>
          <Link to="/menu">Explore Today's Menu (as Guest)</Link>
        </p>
      </div>
    </div>
  );
};

export default PublicLandingPage;
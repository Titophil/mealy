import React, { useEffect, useState } from 'react';
import { fetchAllExternalMeals } from '../Api/Api.jsx';
import './admin.css';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllExternalMeals()
      .then((response) => {
        const data = response.data ?? [];
        if (Array.isArray(data)) {
          setMeals(data);
        } else {
          console.error("Expected an array but got:", data);
          setMeals([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch meals:", err);
        setMeals([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '1rem', marginTop: '100px' }}>
      {loading ? (
        <p>Loading meals...</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginRight: '40px',
            justifyContent: 'flex-start',
          }}
        >
          {meals.map((meal) => (
            <div
              key={meal.idMeal}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                width: '250px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(243, 113, 7, 0.3)',
              }}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <h4>{meal.strMeal}</h4>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>
                {meal.strCategory} &bull; {meal.strArea}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meals;

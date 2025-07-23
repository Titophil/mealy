import React, { useEffect, useState } from 'react';
import { fetchAllExternalMeals } from '../Api/Api.jsx';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllExternalMeals()
      .then((response) => {
        const data = response.data ?? []; // fallback if `data` is undefined
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
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>All Meals from TheMealDB (A–Z)</h2>

      {loading ? (
        <p>Loading meals...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {meals.map((meal) => (
            <div key={meal.idMeal} style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              width: '250px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
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

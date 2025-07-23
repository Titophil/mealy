
import React, { useEffect, useState } from 'react';
import { fetchAllExternalMeals } from '../Api/Api.jsx';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllExternalMeals()
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setMeals(data);
        } else {
          console.error('Expected array but got:', data);
          setMeals([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching meals:', err);
        setMeals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      {/* <h2 style={{ marginBottom: '0.1rem' }}>All Meals from TheMealDB (A–Z)</h2> */}

  {loading ? (
    <p>Loading meals...</p>
  ) : (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {meals.map((meal) => (
        <div
          key={meal.id || meal.idMeal}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            width: '250px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gap:'10px',
          }}
        >
          <img
            src={meal.image || meal.strMealThumb}
            alt={meal.name || meal.strMeal}
            style={{ width: '100%', borderRadius: '4px' }}
          />
          <h4>{meal.name || meal.strMeal}</h4>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            {meal.category || meal.strCategory} &bull; {meal.area || meal.strArea}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Meals;
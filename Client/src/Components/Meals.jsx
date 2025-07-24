// File: src/Components/Meals.jsx
import React, { useEffect, useState } from 'react';
import api from '../Api/Api'; // ✅ corrected path

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [externalMeals, setExternalMeals] = useState([]);
  const [spoonacularMeals, setSpoonacularMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('internal');

  const fetchInternalMeals = async () => {
    try {
      const response = await api.get('/meals');
      setMeals(response.data);
    } catch (err) {
      setError("Failed to load internal meals.");
    }
  };

  const fetchExternalMeals = async () => {
    try {
      const response = await api.get('/meals/external');
      setExternalMeals(response.data);
    } catch (err) {
      setError("Failed to load external meals.");
    }
  };

  const fetchSpoonacular = async () => {
    try {
      const res = await api.get('/meals/spoonacular');
      setSpoonacularMeals(res.data);
    } catch {
      setError("Failed to fetch Spoonacular meals.");
    }
  };

  const handleSourceChange = async (type) => {
    setSource(type);
    if (type === 'external' && externalMeals.length === 0) await fetchExternalMeals();
    if (type === 'spoonacular' && spoonacularMeals.length === 0) await fetchSpoonacular();
  };

  useEffect(() => {
    fetchInternalMeals().finally(() => setLoading(false));
  }, []);

  let data = meals;
  if (source === 'external') data = externalMeals;
  if (source === 'spoonacular') data = spoonacularMeals;

  const cardStyle = {
    border: '1px solid #ccc',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{
        source === 'internal' ? 'Internal Meals' :
        source === 'external' ? 'External Meals (TheMealDB)' :
        'Spoonacular Meals'
      }</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => handleSourceChange('internal')}>Internal</button>
        <button onClick={() => handleSourceChange('external')}>TheMealDB</button>
        <button onClick={() => handleSourceChange('spoonacular')}>Spoonacular</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map((meal) => (
          <li key={meal.idMeal || meal.id} style={cardStyle}>
            <h3>{meal.strMeal || meal.name || meal.title}</h3>
            {(meal.strMealThumb || meal.image) && (
              <img
                src={meal.strMealThumb || meal.image}
                alt={meal.strMeal || meal.title}
                width="100"
              />
            )}
            <p><strong>Category:</strong> {meal.strCategory || 'N/A'}</p>
            <p><strong>Area:</strong> {meal.strArea || 'N/A'}</p>
            <p><strong>Description:</strong> {meal.description || 'No description'}</p>
            <p><strong>Price:</strong> {meal.price ? `KSh ${meal.price}` : 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Meals;

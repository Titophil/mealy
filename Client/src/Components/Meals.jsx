import React, { useContext, useState } from 'react';
import { MealContext } from './MealContext';
import api from '../Api/Api';
import "./admin.css";

const Meals = () => {
  const { meals, loading, error } = useContext(MealContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuDate, setMenuDate] = useState('');
  const [message, setMessage] = useState('');

  const handleAddToMenu = (name) => {
    if (!selectedItems.includes(name)) {
      setSelectedItems([...selectedItems, name]);
    }
  };

  const handleSubmitMenu = async () => {
    if (!menuDate) return setMessage("Please provide a menu date (YYYY-MM-DD)");

    try {
      await api.post('/menus', {
        menu_date: menuDate,
        items: selectedItems
      });
      setMessage("✅ Menu created successfully");
      setSelectedItems([]);
    } catch (err) {
      setMessage("❌ Failed to create menu: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="meals-container">
      <h2 className="meals-title">Available Meals</h2>

      <div className="menu-form">
        <input
          type="date"
          className="date-input"
          value={menuDate}
          onChange={(e) => setMenuDate(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmitMenu}>
          Submit Menu
        </button>
        {message && (
          <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="meal-list">
        {meals.map((meal) => {
          const isAdded = selectedItems.includes(meal.name);
          return (
            <li key={meal.id} className="meal-card">
              <img
                src={meal.image}
                alt={meal.name}
                className="meal-image"
              />
              <h3 className="meal-name">{meal.name}</h3>
              <p className="meal-desc"><strong>Description:</strong> {meal.description || 'No description'}</p>
              <p className="meal-price"><strong>Price:</strong> {meal.price ? `KSh ${meal.price}` : 'N/A'}</p>
              <button
                className={`add-button ${isAdded ? 'added' : ''}`}
                onClick={() => handleAddToMenu(meal.name)}
                disabled={isAdded}
              >
                {isAdded ? '✓ Added' : 'Add to Menu'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Meals;

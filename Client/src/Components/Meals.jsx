import React, { useContext, useState } from 'react';
import { MealContext } from './MealContext';
import api from '../Api/Api';
import "./admin.css";

const Meals = () => {
  const { meals, loading, error, setMeals } = useContext(MealContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuDate, setMenuDate] = useState('');
  const [message, setMessage] = useState('');
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', description: '', price: '', image: '' });
  const [editingMeal, setEditingMeal] = useState(null); // State for editing a meal

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

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/meals', newMeal);
      const addedMeal = response.data;
      setMeals([...meals, addedMeal]);
      setMessage("✅ Meal added successfully");
      setNewMeal({ name: '', description: '', price: '', image: '' });
      setShowAddMealForm(false);
    } catch (err) {
      setMessage("❌ Failed to add meal: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdate = (meal) => {
    setEditingMeal(meal); // Set the meal to edit
    setNewMeal({ name: meal.name, description: meal.description, price: meal.price, image: meal.image });
    setShowAddMealForm(true); // Show the form for editing
  };

  const handleDelete = async (mealId) => {
    if (window.confirm(`Are you sure you want to delete ${meals.find(m => m.id === mealId)?.name}?`)) {
      try {
        await api.delete(`/meals/${mealId}`);
        setMeals(meals.filter(meal => meal.id !== mealId));
        setMessage("✅ Meal deleted successfully");
      } catch (err) {
        setMessage("❌ Failed to delete meal: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (editingMeal) {
      try {
        const response = await api.put(`/meals/${editingMeal.id}`, newMeal);
        const updatedMeal = response.data;
        setMeals(meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
        setMessage("✅ Meal updated successfully");
        setNewMeal({ name: '', description: '', price: '', image: '' });
        setEditingMeal(null);
        setShowAddMealForm(false);
      } catch (err) {
        setMessage("❌ Failed to update meal: " + (err.response?.data?.error || err.message));
      }
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
        <button className="add-meal-button" onClick={() => setShowAddMealForm(true)}>
          Add Meal
        </button>
      </div>

      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}

      {showAddMealForm && (
        <form className="add-meal-form" onSubmit={editingMeal ? handleSaveEdit : handleAddMeal}>
          <input
            type="text"
            placeholder="Meal Name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newMeal.description}
            onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newMeal.price}
            onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newMeal.image}
            onChange={(e) => setNewMeal({ ...newMeal, image: e.target.value })}
          />
          <button type="submit" className="submit-button">
            {editingMeal ? 'Save Changes' : 'Save Meal'}
          </button>
          <button type="button" className="cancel-button" onClick={() => {
            setShowAddMealForm(false);
            setEditingMeal(null);
            setNewMeal({ name: '', description: '', price: '', image: '' });
          }}>
            Cancel
          </button>
        </form>
      )}

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
              <button
                className="update-button"
                onClick={() => handleUpdate(meal)}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(meal.id)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Meals;
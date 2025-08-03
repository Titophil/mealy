import React, { useState, useEffect } from 'react';
import { fetchMeals, createMenu, createMeal, getMenuByDate } from '../Api/Api';
import './MenuBuilder.css';

function MenuBuilder() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [menuExists, setMenuExists] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  // Fetch meals + menu for date
  useEffect(() => {
    const loadData = async () => {
      try {
        const mealsResponse = await fetchMeals();
        setMeals(mealsResponse.data);
      } catch (err) {
        setMessage('❌ Failed to fetch meals');
        console.error('Fetch meals error:', err);
      }

      try {
        const menuResponse = await getMenuByDate(selectedDate);
        setSelectedMeals(menuResponse.data.items || []);
        setMenuExists(true);
      } catch (err) {
        if (err.response?.status === 404) {
          setMenuExists(false);
          setSelectedMeals([]);
        } else {
          setMessage('❌ Failed to load menu');
          console.error('Fetch menu error:', err);
        }
      }
    };
    loadData();
  }, [selectedDate]);

  const toggleMealSelection = (mealName) => {
    setSelectedMeals((prev) =>
      prev.includes(mealName)
        ? prev.filter((name) => name !== mealName)
        : [...prev, mealName]
    );
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (menuExists) {
        await updateMenuItemStatus(selectedDate, selectedMeals);
        setMessage('✅ Menu updated!');
      } else {
        await createMenu({ menu_date: selectedDate, items: selectedMeals });
        setMenuExists(true);
        setMessage('✅ Menu created!');
      }
    } catch (err) {
      setMessage('❌ Failed to submit menu.');
      console.error('Submit menu error:', err);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      await createMeal({
        ...newMeal,
        price: parseFloat(newMeal.price),
        caterer_id: 1, // Adjust as needed
      });
      setMessage('✅ Meal added!');
      setNewMeal({ name: '', description: '', price: '', image_url: '' });
      setShowAddForm(false);
      const res = await fetchMeals();
      setMeals(res.data);
    } catch (err) {
      setMessage('❌ Failed to add meal');
      console.error('Add meal error:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">🍽️ Menu Builder</h2>
      <p className="text-sm mb-4">Selected date: {selectedDate}</p>

      {message && <p className="mb-4 text-center text-red-600">{message}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showAddForm ? 'Hide Meal Form' : '➕ Add New Meal'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddMeal} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Meal Name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newMeal.image_url}
            onChange={(e) => setNewMeal({ ...newMeal, image_url: e.target.value })}
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
            step="0.01"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded col-span-1 sm:col-span-2">
            Save Meal
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <div key={meal.id} className="border rounded shadow p-4 bg-white">
            <img
              src={meal.image_url || '/placeholder.jpg'}
              className="h-32 w-full object-cover mb-2"
              alt={meal.name}
            />
            <h3 className="font-bold">{meal.name}</h3>
            <p>{meal.description}</p>
            <p className="text-sm text-gray-700">KES {meal.price}</p>
            <button
              onClick={() => toggleMealSelection(meal.name)}
              className={`mt-2 px-3 py-1 rounded ${
                selectedMeals.includes(meal.name) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {selectedMeals.includes(meal.name) ? 'Remove from Menu' : 'Add to Menu'}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleMenuSubmit} className="mt-6">
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">
          {menuExists ? 'Update Menu' : 'Create Menu'}
        </button>
      </form>
    </div>
  );
}

export default MenuBuilder;
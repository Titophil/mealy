import React, { useEffect, useState } from "react";
import { getMenuByDate } from "../api/menuApi";

function MenuViewer() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // default to today
  });

  const fetchMenu = (date) => {
    getMenuByDate(date)
      .then((res) => {
        setMenu(res.data);
        setError("");
      })
      .catch(() => {
        setMenu(null);
        setError("❌ No menu found for this date");
      });
  };

  const handleOrder = (mealName) => {
    // Placeholder function - replace with your order logic
    console.log(`Order placed for: ${mealName}`);
    // Example: You could call an API or navigate to an order page
    // e.g., api.post('/orders', { meal_name: mealName, menu_date: selectedDate });
  };

  useEffect(() => {
    fetchMenu(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🍽️ Menu Viewer</h2>

      {/* 📅 Date Picker */}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded shadow"
        />
      </div>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      {!menu && !error && <p className="text-center mt-4">Loading...</p>}

      {menu && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Menu for {menu.menu_date}
          </h3>

          <div className="meal-list">
            {menu.items.map((meal, index) => (
              <div
                key={index}
                className="meal-card"
              >
                {meal.image? (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="meal-image"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="meal-name">{meal.name}</h3>
                <p className="meal-desc">
                  <strong>Description:</strong> {meal.description || 'No description'}
                </p>
                <p className="meal-price">
                  <strong>Price:</strong> {meal.price ? `KSh ${meal.price}` : 'N/A'}
                </p>
                <button
                  className="add-button" /* Reuse the existing button style */
                  onClick={() => handleOrder(meal.name)}
                >
                  Order
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MenuViewer;
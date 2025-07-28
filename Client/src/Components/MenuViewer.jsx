import React, { useEffect, useState } from "react";
import { getMenuByDate } from "../api/menuApi";

function MenuViewer() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // default to today (2025-07-28)
  });

  const fetchMenu = async (date) => {
    try {
      const response = await getMenuByDate(date);
      console.log("API Response:", response.data); // Debug log
      if (response.data && response.data.items && response.data.items.length > 0) {
        setMenu(response.data);
        setError("");
      } else {
        setMenu(null);
        setError("❌ No menu items found for this date");
      }
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setMenu(null);
      setError(`❌ Failed to load menu: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleOrder = (mealName) => {
    console.log(`Order placed for: ${mealName}`);
    // Replace with actual order logic
  };

  useEffect(() => {
    fetchMenu(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🍽️ Menu</h2>

      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded shadow"
        />
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {!menu && !error && <p className="text-center mt-4">Loading...</p>}

      {menu && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Menu for {new Date(menu.menu_date).toLocaleDateString()}
          </h3>
          <div className="meal-list grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.items.map((meal, index) => (
              <div
                key={index}
                className="meal-card bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                {meal.image ? (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="meal-image w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-lg">
                    No Image
                  </div>
                )}
                <h3 className="meal-name text-lg font-semibold mt-2">{meal.name}</h3>
                <p className="meal-desc text-gray-700">
                  <strong>Description:</strong> {meal.description || 'No description'}
                </p>
                <p className="meal-price text-gray-800">
                  <strong>Price:</strong> {meal.price ? `KSh ${meal.price}` : 'N/A'}
                </p>
                <button
                  className="add-button mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
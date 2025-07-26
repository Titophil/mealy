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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.items.map((meal, index) => (
              <div
                key={index}
                className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition"
              >
                {meal.image_url ? (
                  <img
                    src={meal.image_url}
                    alt={meal.name}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="mt-3 text-lg font-semibold">{meal.name}</h3>
                <p className="text-gray-600 text-sm">{meal.description}</p>
                <p className="text-green-700 font-bold mt-1">Ksh {meal.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MenuViewer;

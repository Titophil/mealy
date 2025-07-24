import React, { useEffect, useState } from "react";
import { getMenuByDate } from "../api/menuApi";

function MenuViewer() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getMenuByDate(today)
      .then((res) => setMenu(res.data))
      .catch(() => setError("❌ No menu found for today"));
  }, []);

  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!menu) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🍛 Today's Menu ({menu.menu_date})
      </h2>

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
    </div>
  );
}

export default MenuViewer;

import React, { useEffect, useState } from "react";
import axios from "axios";

function MenuBuilder() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [menuExists, setMenuExists] = useState(false);
  const [message, setMessage] = useState("");
  const [newMeal, setNewMeal] = useState({ name: "", description: "", price: "" });
  const [editMeal, setEditMeal] = useState(null);

  useEffect(() => {
    // Fetch all available meals
    const fetchMeals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meals");
        if (res.data.length === 0) {
          setMessage("No meals found. Add a meal to get started.");
        } else {
          setMeals(res.data);
          setMessage("");
        }
      } catch (err) {
        console.error("❌ Error fetching meals:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config,
        });
        setMessage(`Failed to load meals: ${err.message}${err.response ? ` (Status: ${err.response.status}, ${err.response.data?.error || "No error details"})` : ""}`);
      }
    };

    // Check if a menu for the selected date exists
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/menus/${selectedDate}`);
        setSelectedMeals(res.data.items || []);
        setMenuExists(true);
      } catch (err) {
        console.error("❌ Error fetching menu:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 404) {
          setMenuExists(false);
          setSelectedMeals([]);
        } else {
          setMessage(`Failed to load menu: ${err.message}${err.response ? ` (Status: ${err.response.status}, ${err.response.data?.error || "No error details"})` : ""}`);
        }
      }
    };

    fetchMeals();
    fetchMenu();
  }, [selectedDate]);

  const handleCheck = (mealName) => {
    setSelectedMeals((prev) =>
      prev.includes(mealName)
        ? prev.filter((item) => item !== mealName)
        : [...prev, mealName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMeals.length) {
      setMessage("❌ Please select at least one meal for the menu.");
      return;
    }

    try {
      if (menuExists) {
        await axios.put(`http://localhost:5000/api/menus/${selectedDate}`, {
          items: selectedMeals,
        });
        setMessage("✅ Menu updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/menus", {
          menu_date: selectedDate,
          items: selectedMeals,
        });
        setMessage("✅ Menu created successfully!");
        setMenuExists(true);
      }
    } catch (err) {
      console.error("❌ Error submitting menu:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setMessage(`Failed to submit menu: ${err.message}${err.response ? ` (Status: ${err.response.status}, ${err.response.data?.error || "No error details"})` : ""}`);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.price) {
      setMessage("❌ Meal name and price are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/meals", {
        name: newMeal.name,
        description: newMeal.description,
        price: parseFloat(newMeal.price),
        caterer_id: 1, // Temporary hardcoded caterer_id
      });
      setMessage("✅ Meal added successfully!");
      const res = await axios.get("http://localhost:5000/api/meals");
      setMeals(res.data);
      setNewMeal({ name: "", description: "", price: "" });
    } catch (err) {
      console.error("❌ Error adding meal:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setMessage(`Failed to add meal: ${err.message}${err.response ? ` (Status: ${err.response.status}, ${err.response.data?.error || "No error details"})` : ""}`);
    }
  };

  const handleEditMeal = async (e) => {
    e.preventDefault();
    if (!editMeal.name || !editMeal.price) {
      setMessage("❌ Meal name and price are required.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/meals/${editMeal.id}`, {
        name: editMeal.name,
        description: editMeal.description,
        price: parseFloat(editMeal.price),
        caterer_id: 1, // Temporary hardcoded caterer_id
      });
      setMessage("✅ Meal updated successfully!");
      const res = await axios.get("http://localhost:5000/api/meals");
      setMeals(res.data);
      setEditMeal(null);
    } catch (err) {
      console.error("❌ Error updating meal:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setMessage(`Failed to update meal: ${err.message}${err.response ? ` (Status: ${err.response.status}, ${err.response.data?.error || "No error details"})` : ""}`);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(`http://localhost:5000/api/meals/${mealId}`);
      setMessage("✅ Meal deleted successfully!");
      setMeals(meals.filter((meal) => meal.id !== mealId));
      setSelectedMeals(selectedMeals.filter((name) => !meals.find((m) => m.id === mealId && m.name === name)));
    } catch (err) {
      console.error("❌ Error deleting meal:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setMessage(`Failed to delete meal: ${err.message}${err.response ? ` (Status: ${err.response.status}, ${err.response.data?.error || "No error details"})` : ""}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🍽️ Menu Management for {selectedDate}</h2>
      {message && <p className={`text-center mb-4 ${message.includes("❌") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

      {/* Date Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* Add Meal Form */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Add New Meal</h3>
        <form onSubmit={handleAddMeal} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Meal Name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newMeal.description}
            onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <input
            type="number"
            placeholder="Price (KES)"
            value={newMeal.price}
            onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
            step="0.01"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 col-span-1 sm:col-span-3"
          >
            Add Meal
          </button>
        </form>
      </div>

      {/* Edit Meal Form */}
      {editMeal && (
        <div className="mb-8 p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Edit Meal: {editMeal.name}</h3>
          <form onSubmit={handleEditMeal} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text"
              value={editMeal.name}
              onChange={(e) => setEditMeal({ ...editMeal, name: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
            <input
              type="text"
              value={editMeal.description}
              onChange={(e) => setEditMeal({ ...editMeal, description: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              value={editMeal.price}
              onChange={(e) => setEditMeal({ ...editMeal, price: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
              step="0.01"
            />
            <div className="col-span-1 sm:col-span-3 flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMeal(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Builder Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {meals.map((meal) => (
            <div key={meal.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <img
                src={meal.image_url || "/placeholder.jpg"}
                alt={meal.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <div>
                <h3 className="text-lg font-semibold">{meal.name}</h3>
                <p className="text-gray-600">{meal.description || "No description available."}</p>
                <p className="text-gray-800 font-medium">KES {meal.price} • ⏱️ {meal.time || "15-20 min"}</p>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={selectedMeals.includes(meal.name)}
                    onChange={() => handleCheck(meal.name)}
                    className="h-5 w-5 text-indigo-600"
                  />
                  Add to Menu
                </label>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditMeal(meal)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600"
        >
          {menuExists ? "✅ Update Menu" : "✅ Create Menu"}
        </button>
      </form>
    </div>
  );
}

export default MenuBuilder;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./menuBuilder.css";

function MenuBuilder() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [message, setMessage] = useState("");
  const [menuExists, setMenuExists] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Fetch all available meals
    axios.get("http://localhost:5000/api/meals")
      .then(res => setMeals(res.data))
      .catch(err => console.error("❌ Error fetching meals", err));

    // Check if a menu for today already exists
    axios.get(`http://localhost:5000/api/menus/${today}`)
      .then(res => {
        const existingMenu = res.data;
        setSelectedMeals(existingMenu.items);
        setMenuExists(true);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setMenuExists(false);
        } else {
          console.error("❌ Error fetching menu", err);
        }
      });
  }, []);

  const handleCheck = (mealName) => {
    setSelectedMeals((prev) =>
      prev.includes(mealName)
        ? prev.filter((item) => item !== mealName)
        : [...prev, mealName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (menuExists) {
        // Update existing menu
        await axios.put(`http://localhost:5000/api/menus/${today}`, {
          items: selectedMeals,
        });
        setMessage("✅ Menu updated successfully!");
      } else {
        // Create a new menu
        await axios.post("http://localhost:5000/api/menus", {
          menu_date: today,
          items: selectedMeals,
        });
        setMessage("✅ Menu created successfully!");
        setMenuExists(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to submit menu.");
    }
  };

  const handleEdit = (mealId) => {
    alert(`✏️ Edit modal or page coming soon for meal ID: ${mealId}`);
  };

  return (
    <div className="menu-builder-container">
      <h2>🍽️ Meal Options Management</h2>
      {message && <p className="menu-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="menu-grid">
          {meals.map((meal) => (
            <div key={meal.id} className="menu-card">
              <img
                src={meal.image_url || "/placeholder.jpg"}
                alt={meal.name}
                className="menu-image"
              />
              <div className="menu-info">
                <h3>{meal.name}</h3>
                <p>{meal.description || "No description available."}</p>
                <p>
                  <strong>KES {meal.price}</strong> • ⏱️ {meal.time || "15-20 min"}
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMeals.includes(meal.name)}
                    onChange={() => handleCheck(meal.name)}
                  />
                  Add to Menu
                </label>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEdit(meal.id)}
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          {menuExists ? "✅ Update Today’s Menu" : "✅ Submit Today’s Menu"}
        </button>
      </form>
    </div>
  );
}

export default MenuBuilder;

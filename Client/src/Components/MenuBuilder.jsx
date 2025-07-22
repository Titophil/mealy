import React, { useEffect, useState } from "react";
import axios from "axios";
import { createMenu } from "../api/menuApi";
import "./menuBuilder.css";

function MenuBuilder() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/meals")
      .then(res => setMeals(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCheck = (meal) => {
    setSelectedMeals((prev) =>
      prev.includes(meal.name)
        ? prev.filter((item) => item !== meal.name)
        : [...prev, meal.name]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    try {
      await createMenu({ menu_date: today, items: selectedMeals });
      setMessage("✅ Menu created successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to create menu.");
    }
  };

  const handleEdit = (mealId) => {
    alert(`Edit modal/page coming soon for meal ID: ${mealId}`);
    // You can later implement modal or redirect to a form page
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
                <p><strong>${meal.price || "12.00"}</strong> • ⏱️ {meal.time || "15-20 min"}</p>

                <label>
                  <input
                    type="checkbox"
                    checked={selectedMeals.includes(meal.name)}
                    onChange={() => handleCheck(meal)}
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
          ✅ Submit Today’s Menu
        </button>
      </form>
    </div>
  );
}

export default MenuBuilder;

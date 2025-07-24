import React, { createContext, useState, useEffect } from 'react';
import { fetchAllExternalMeals } from '../Api/Api.jsx'; // Adjust path if needed

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch meals from external API
  useEffect(() => {
    fetchAllExternalMeals()
      .then((response) => {
        const data = response.data ?? [];
        if (Array.isArray(data)) {
          setMeals(data);
        } else {
          console.error("Expected an array but got:", data);
          setMeals([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch meals:", err);
        setMeals([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add a new meal (optional if using only external API)
  const addMeal = (meal) => {
    const newMeal = {
      ...meal,
      idMeal:
        meals.length > 0
          ? String(Number(meals[meals.length - 1].idMeal || meals.length) + 1)
          : '1',
    };
    setMeals((prevMeals) => [...prevMeals, newMeal]);
  };

  return (
    <MealContext.Provider value={{ meals, addMeal, loading }}>
      {children}
    </MealContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';
import { fetchMeals } from '../Api/Api'; // Adjusted to import fetchMeals
import { createMeal } from '../Api/Api'; // Adjusted to import createMeal


export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seeded meals from internal API
  useEffect(() => {
    fetchMeals()
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
        setError("Failed to load meals.");
        setMeals([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add a new meal (optional, for internal API usage)
  const addMeal = async (mealData) => {
    try {
      const response = await createMeal(mealData);
      const newMeal = response.data;
      setMeals((prevMeals) => [...prevMeals, newMeal]);
    } catch (err) {
      console.error("Failed to add meal:", err);
      setError("Failed to add meal.");
    }
  };

  return (
    <MealContext.Provider value={{ meals, addMeal, loading, error }}>
      {children}
    </MealContext.Provider>
  );
};

export default MealProvider;
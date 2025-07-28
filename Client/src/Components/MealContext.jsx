import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchMeals, createMeal, updateMeal, deleteMeal } from '../Api/Api'; // Added updateMeal and deleteMeal

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  // Fetch seeded meals from internal API
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const response = await fetchMeals();
        const data = response.data ?? [];
        if (Array.isArray(data)) {
          setMeals(data);
        } else {
          console.error("Expected an array but got:", data);
          setMeals([]);
          setError("Invalid data format received.");
        }
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setError("Failed to load meals.");
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  // Add a new meal
  const addMeal = async (mealData) => {
    try {
      const response = await createMeal(mealData);
      const newMeal = response.data;
      setMeals((prevMeals) => [...prevMeals, newMeal]);
      setError(null);
      return newMeal; // Return for potential use in calling component
    } catch (err) {
      console.error("Failed to add meal:", err);
      setError("Failed to add meal: " + (err.response?.data?.error || err.message));
      throw err; // Re-throw to allow calling component to handle
    }
  };

  // Update an existing meal
  const updateMealContext = async (mealId, mealData) => {
    try {
      const response = await updateMeal(mealId, mealData);
      const updatedMeal = response.data;
      setMeals((prevMeals) =>
        prevMeals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal))
      );
      setError(null);
      return updatedMeal;
    } catch (err) {
      console.error("Failed to update meal:", err);
      setError("Failed to update meal: " + (err.response?.data?.error || err.message));
      throw err;
    }
  };

  // Delete a meal
  const deleteMealContext = async (mealId) => {
    try {
      await deleteMeal(mealId);
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
      setError(null);
    } catch (err) {
      console.error("Failed to delete meal:", err);
      setError("Failed to delete meal: " + (err.response?.data?.error || err.message));
      throw err;
    }
  };

  return (
    <MealContext.Provider
      value={{ meals, setMeals, loading, error, addMeal, updateMeal: updateMealContext, deleteMeal: deleteMealContext }}
    >
      {children}
    </MealContext.Provider>
  );
};

// Custom hook to use the MealContext
export const useMealContext = () => useContext(MealContext);
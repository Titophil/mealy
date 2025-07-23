import React, { createContext, useState } from 'react';

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Chicken Biryani' },
    { id: 2, name: 'Vegetable Curry' },
    { id: 3, name: 'Mutton Rogan Josh' },
  ]);

  const addMeal = (meal) => {
    setMeals([...meals, meal]);
  };

  return (
    <MealContext.Provider value={{ meals, addMeal }}>
      {children}
    </MealContext.Provider>
  );
};

import React, { useContext } from 'react';
import { MealContext } from './MealContext';

const MealList = () => {
  const { meals } = useContext(MealContext);

  return (
    <div>
      <h2>Meal List</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>{meal.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MealList;

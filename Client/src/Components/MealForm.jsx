import React, { useState, useContext } from 'react';
import { MealContext } from './MealContext';
import "./admin.css";


const MealForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { addMeal } = useContext(MealContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeal = {
      id: Date.now(),
      name,
      description,
      price,
    };
    addMeal(newMeal);
    setName('');
    setDescription('');
    setPrice('');
  };

  return (
    <div>
      <h2>Meal Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MealForm;

import React, {useEffect,useState} from 'react';
import {createMenu} from '../api/menuApi';
import axios from 'axios';



function MenuBuilder (){
    const [meals, setMeals] =useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [message, setMessage] =useState('');

    useEffect(()=>{
        axios.get('htttp://localhost:5000/api/meals')
        .then(res =>setMeals(res.data))
        .catch(err => console.log(err));
    },[]);

    const handleCheck = (meal) =>{
        setSelectedMeals(prev => prev.includes(meal)? prev.filter(item => item !== meal) : [...prev,meal]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];

        try{
            const res =await createMenu({menu_date: today ,items : selectedMeals });
            setMessage('Menu created successfully!');

        }
        catch (err) {
            setMessage(err.response?.data?.error || 'Failed to create menu.');
        }
    };

    return (
        <div>
            <h2>Meal Options Management</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                {meals.map((meal)=>(
                    <div key={meal.id}>
                        <input type ='checkbox' onChange={() => handleCheck(meal.name)}/>{meal.name}

                    </div>
                ))}
                <button type='submit'>Submit Menu</button>

            </form>

        </div>
    );
}

export default MenuBuilder;
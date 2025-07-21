import React, {useEffect,useState}  from 'react';
import { getMenuByDate } from '../api/menuApi';

function MenuViewer(){
    const [menu, setMenu] = useState(null);
    const [error,setError] = useState('');
    

    useEffect(()=>{
        const today = new Date().toISOString().split('T')[0];
        getMenuByDate(today)
        .then(res => setMenu(res.data))
        .catch(err => setError('No menu found for today'));

    },[]);


    if (error) return <p>{error}</p>;
    if (!menu) return <p>Loading...</p>


    return(
        <div>
            <h2>Today's Menu ({menu.menu_date})</h2>
            <ul>
                {menu.items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );

}

export default MenuViewer;
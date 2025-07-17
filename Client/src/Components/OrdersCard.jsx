import React, { useEffect, useState } from 'react';


export default function OrdersCard() {
 const [orders, setOrders] = useState([]);


 useEffect(() => {
   fetch('/api/orders/details', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
     }
   })
     .then(res => res.json())
     .then(data => setOrders(data))
     .catch(err => console.error('Failed to load order details:', err));
 }, []);


 return (
   <div
     className="orders-card"
     style={{
       border: '1px solid #ccc',
       borderRadius: '10px',
       padding: '1rem',
       backgroundColor: '#fff',
       maxHeight: '500px',
       overflowY: 'auto',
       width: '100%'
     }}
   >
     <h3 style={{ marginBottom: '1rem' }}>Orders Summary</h3>


     {orders.length === 0 ? (
       <p>No orders found.</p>
     ) : (
       orders.map((order, idx) => (
         <div
           key={idx}
           style={{
             borderBottom: '1px solid #eee',
             paddingBottom: '0.5rem',
             marginBottom: '0.5rem'
           }}
         >
           <p><strong>Customer:</strong> {order.customer_name}</p>
           <p><strong>Food Ordered:</strong> {order.food_name}</p>
           <p><strong>Delivered:</strong> {order.delivered ? 'Yes' : 'No'}</p>
           <p><strong>Paid:</strong> {order.paid ? 'Yes' : 'No'}</p>
         </div>
       ))
     )}
   </div>
 );
}

import { useEffect, useState } from 'react';
import api from "../Api/Api";
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip,
 CartesianGrid,
 ResponsiveContainer,
 BarChart,
 Bar,
 Legend
} from 'recharts';


export default function RevenueChart() {
 const [dailyData, setDailyData] = useState([]);
 const [thisMonth, setThisMonth] = useState(0);
 const [lastMonth, setLastMonth] = useState(0);
 const [today, setToday] = useState(0);


 useEffect(() => {
   fetchRevenue(); // Fetch on load
   const interval = setInterval(fetchRevenue, 24 * 60 * 60 * 1000); // Update every 24 hours
   return () => clearInterval(interval);
 }, []);


 const fetchRevenue = () => {
   api.get('admin/revenue')
     .then((res) => {
       setDailyData(res.data.daily || []);
       setThisMonth(res.data.this_month_total);
       setLastMonth(res.data.last_month_total);
       setToday(res.data.today_total);
     })
     .catch(err => console.error('Revenue fetch error:', err));
 };


 return (
   <div className="revenue-graph-container">
    
     {/* Top Card Showing Today's Revenue */}
     <div className="today-card">
       <h2>Today's Revenue</h2>
       <p className="amount">Ksh {today.toLocaleString()}</p>
     </div>


     {/* Bar Chart for Month Comparison */}
     <h3>This Month vs Last Month</h3>
     <ResponsiveContainer width="100%" height={250}>
       <BarChart data={[
         { name: 'Last Month', value: lastMonth },
         { name: 'This Month', value: thisMonth }
       ]}>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="name" />
         <YAxis />
         <Tooltip />
         <Bar dataKey="value" fill="#ffa726" />
       </BarChart>
     </ResponsiveContainer>


     {/* Line Chart for Daily Revenue */}
     <h3>Daily Revenue (This Month)</h3>
     <ResponsiveContainer width="100%" height={300}>
       <LineChart data={dailyData}>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
         <YAxis />
         <Tooltip />
         <Legend />
         <Line type="monotone" dataKey="amount" stroke="#d35400" name="Daily Revenue" />
       </LineChart>
     </ResponsiveContainer>
   </div>
 );
}



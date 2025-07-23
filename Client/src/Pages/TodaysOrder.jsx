import { useEffect, useState } from 'react';

const TodaysOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysOrder()
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white shadow rounded">
      {order ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Today's Order</h2>
          <p><strong>Menu Item ID:</strong> {order.menu_item_id}</p>
          <p><strong>Order Time:</strong> {new Date(order.order_date).toLocaleTimeString()}</p>
        </>
      ) : (
        <p>No order placed today.</p>
      )}
    </div>
  );
};

export default TodaysOrder;

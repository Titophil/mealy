import React, { useEffect, useState } from 'react';
import { getMenuByDate } from '../api/menuApi';

function NotificationBanner() {
  const [show, setShow] = useState(false);

    useEffect(() => {
    const checkMenu = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const res = await getMenuByDate(today);
        if (res.data) setShow(true);
      } catch (e) {
        setShow(false);
      }
    };

    const interval = setInterval(checkMenu, 60000); 
    checkMenu(); 

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div style={{ background: 'lightgreen', padding: '10px' }}>
        Today’s menu is live!
      <button onClick={() => setShow(false)} style={{ float: 'right' }}>X</button>
    </div>
  );
}

export default NotificationBanner;


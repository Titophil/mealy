import React, { useEffect, useState } from 'react';
import { getMenuByDate } from '../api/menuApi';

function NotificationBanner() {
  const [show, setShow] = useState(false);

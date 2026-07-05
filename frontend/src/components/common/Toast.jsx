import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const Toast = ({ message, type = 'success', duration = 3000 }) => {
  useEffect(() => {
    toast[type](message, { duration });
  }, [message, type, duration]);
  return null;
};

export default Toast;
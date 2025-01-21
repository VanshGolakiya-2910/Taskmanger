// File: components/ui/Button.jsx
import React from 'react';

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

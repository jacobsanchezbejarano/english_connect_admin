// components/Card.jsx
import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow p-4 w-full max-w-xl mx-auto mb-4">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="text-gray-800">{children}</div>
);

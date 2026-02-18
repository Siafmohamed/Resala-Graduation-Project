import React from 'react';
import { Routes, Route } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      {/* Add more routes here */}
    </Routes>
  );
};

export default AppRoutes;
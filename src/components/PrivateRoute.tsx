import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
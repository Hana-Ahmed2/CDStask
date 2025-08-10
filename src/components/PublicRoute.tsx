import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      
      const parsedToken = JSON.parse(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return parsedToken.expiresIn > currentTime;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/Nextpage" replace />;
  }

  // If not authenticated, render the public component (login page)
  return <>{children}</>;
};

export default PublicRoute;
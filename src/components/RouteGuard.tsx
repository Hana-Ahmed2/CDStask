import React from 'react';
import { Navigate } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  // Check if user is authenticated by looking for token in localStorage
  const isAuthenticated = (): boolean => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      const parsedToken = JSON.parse(token);
      const currentTime = Math.floor(Date.now() / 1000); //compare current epoch time with token expiration

      // Check if token exists and is not expired
      return parsedToken.expiresIn > currentTime;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default RouteGuard;
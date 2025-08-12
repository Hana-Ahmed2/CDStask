import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';
import App from './App.tsx';
import Home from './Home.tsx';
import RouteGuard from './components/RouteGuard';
import PublicRoute from './components/PublicRoute.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route - only accessible when not authenticated */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <App />
              </PublicRoute>
            } 
          />

          {/* Protected route - only accessible when authenticated */}
          <Route 
            path="/Home" 
            element={
              <RouteGuard>
                <Home />
              </RouteGuard>
            } 
          />
          
          {/* Catch-all route - redirect to login if not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CustomThemeProvider>
  </React.StrictMode>
);
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';
import App from './App.tsx';
import Home from './Home.tsx';
import AddBusinessUnit from './pages/AddBusinessUnit.tsx';
import AddActiveDirectory from './pages/AddActiveDirectory.tsx';
import BusinessUnitsPage from './pages/BusinessUnitsPage.tsx';
import ActiveDirectoriesPage from './pages/ActiveDirectoriesPage.tsx';
import RouteGuard from './components/RouteGuard';
import PublicRoute from './components/PublicRoute.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
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

          {/* Protected routes - only accessible when authenticated */}
          <Route 
            path="/Home" 
            element={
              <RouteGuard>
                <Home />
              </RouteGuard>
            } 
          />
          
          <Route 
            path="/add-business-unit" 
            element={
              <RouteGuard>
                <AddBusinessUnit />
              </RouteGuard>
            } 
          />
          
          <Route 
            path="/add-active-directory" 
            element={
              <RouteGuard>
                <AddActiveDirectory />
              </RouteGuard>
            } 
          />
          
          <Route 
            path="/business-units" 
            element={
              <RouteGuard>
                <BusinessUnitsPage />
              </RouteGuard>
            } 
          />
          
          <Route 
            path="/active-directories" 
            element={
              <RouteGuard>
                <ActiveDirectoriesPage />
              </RouteGuard>
            } 
          />
          
          {/* Catch-all route - redirect to login if not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CustomThemeProvider>
  </StrictMode>
);
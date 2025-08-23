import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateToken } from '../auth';
import type { JwtToken, User } from '../auth';

interface AuthContextType {
  token: JwtToken | null;
  user: User | null;
  login: (token: JwtToken) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<JwtToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const tokenRefreshTimeout = useRef<number | null>(null);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const parsedToken: JwtToken = JSON.parse(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (parsedToken.expiresIn > currentTime) {
          setToken(parsedToken);
          setUser(parsedToken.user);
          scheduleTokenRefresh(parsedToken);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error parsing stored token:', error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  // Cleanup timeout 
  useEffect(() => {
    return () => {
      if (tokenRefreshTimeout.current) {
        console.log('AuthContext: Cleaning up timeout ');
        clearTimeout(tokenRefreshTimeout.current);
      }
    };
  }, []);

  // Function to schedule token refresh
  const scheduleTokenRefresh = (token: JwtToken) => {
    console.log('AuthContext: Scheduling token refresh for token:', token);
    
    if (tokenRefreshTimeout.current) {
      console.log('AuthContext: Clearing existing timeout before setting new one');
      clearTimeout(tokenRefreshTimeout.current);
    }

    const refreshDelay = (token.expiresIn - 60) * 1000; 
    console.log('AuthContext: Scheduling token refresh in', refreshDelay / 1000, 'seconds');

    tokenRefreshTimeout.current = setTimeout(async () => {
      console.log('AuthContext: Token refresh timeout triggered');
      
      // Check current state and localStorage to ensure user is still logged in
      const currentStoredToken = localStorage.getItem('authToken');
      if (!currentStoredToken) {
        console.log('AuthContext: No token in localStorage, user has logged out');
        return;
      }
      
      let currentToken: JwtToken;
      try {
        currentToken = JSON.parse(currentStoredToken);
      } catch (error) {
        console.log('AuthContext: Invalid token in localStorage');
        return;
      }
      
      try {
        console.log('AuthContext: Triggering token refresh...');
        const newToken = await updateToken(currentToken);
        console.log('AuthContext: Token refreshed successfully:', newToken);
        
        // Double-check that user is still logged in before updating
        const doubleCheckToken = localStorage.getItem('authToken');
        if (doubleCheckToken) {
          setToken(newToken);
          setUser(newToken.user);
          localStorage.setItem('authToken', JSON.stringify(newToken));
          scheduleTokenRefresh(newToken);
        } else {
          console.log('AuthContext: User logged out during refresh, aborting');
        }
      } catch (err) {
        console.error('AuthContext: Failed to refresh token:', err);
        logout(); // Use the logout function to properly clean up
      }
    }, refreshDelay);
  };

  // Login function
  const login = (newToken: JwtToken) => {
    setToken(newToken);
    setUser(newToken.user);
    localStorage.setItem('authToken', JSON.stringify(newToken));
    scheduleTokenRefresh(newToken);
  };

  // Logout function - properly clears everything
  const logout = () => {
    console.log('AuthContext: Starting logout process...');
    console.log('AuthContext: Current token before logout:', token);
    
    // Clear the token refresh timeout
    if (tokenRefreshTimeout.current) {
      console.log('AuthContext: Clearing token refresh timeout');
      clearTimeout(tokenRefreshTimeout.current);
      tokenRefreshTimeout.current = null;
    }
    
    // Clear token state and localStorage
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('users');
    
    console.log('AuthContext: Token cleared from state and localStorage');
    
    // Navigate to login page
    navigate('/', { replace: true });
  };

  const isAuthenticated = Boolean(token);

  const value: AuthContextType = {
    token,
    user,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
  
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('accessToken');
        setUser(null);
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
  
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);
  

  const login = async (credentials) => {
    setError('');
  
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: credentials.username,
        password: credentials.password,
      });
  
      if (response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return true; // success
      } 
    } catch (error) {
      const msg = `${error.response?.data?.error}. Please try again` || error.response?.data?.message || `${error.message}. Please try again` || 'Invalid credentials. Please try again.';
      setError(msg);
      throw new Error(msg); // throw so caller can handle it
    }
  };  

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    // Optional: Call /logout endpoint on the server if needed
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const auth = useAuth();

    if (auth.loading) return <div>Loading...</div>;
    return auth.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};
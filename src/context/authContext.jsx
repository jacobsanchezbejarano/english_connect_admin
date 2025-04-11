import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axiosInstance'; // Use axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/profile'); // Uses axiosInstance
        setUser(response.data.user);
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('accessToken'); // Token might be invalid
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setError('');
  
    try {
      const response = await api.post('/auth/login', {
        email: credentials.username,
        password: credentials.password,
      });
  
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return true; // success
      } else {
        const msg = 'Login successful, but no token received.';
        setError(msg);
        throw new Error(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials. Please try again.';
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
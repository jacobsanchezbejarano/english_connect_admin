import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Make sure you have axios installed: npm install axios
import { URL } from '../constants/url';

// Create the authentication context
const AuthContext = createContext();

// Create an authentication context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // To handle login errors

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      // You might want to add logic here to validate the token
      // by making a request to your API to get user data.
      // For simplicity in this example, we'll just assume the token is valid.
      // Replace this with your actual token validation logic.
      axios.get(URL + '/auth/profile', { // Example endpoint to get user data with token
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(response => {
        setUser(response.data.user); // Assuming your API returns user data
        setLoading(false);
      })
      .catch(error => {
        console.error('Error validating token:', error);
        localStorage.removeItem('accessToken');
        setUser(null);
        setLoading(false);
      });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Function to log in
  const login = async (credentials) => {
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post(URL + '/auth/login', {
        email: credentials.username, // Assuming your login form uses 'username' for email
        password: credentials.password,
      });

      console.log('Login Success:', response.data);
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user); // Assuming your login response also includes user data
        setLoading(false);
      } else {
        console.warn('accessToken not found in the login response.');
        setError('Login successful, but the authentication token was not received.');
        setLoading(false);
      }

    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Values to be provided to consuming components
  const value = {
    user,
    loading,
    error, // Expose the error state
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// (Optional) Create an HOC to protect routes
export const withAuth = (WrappedComponent) => {
  return (props) => {
    const auth = useAuth();

    useEffect(() => {
      if (!auth.isAuthenticated && !auth.loading) {
      }
    }, [auth.isAuthenticated, auth.loading]);

    if (auth.loading) {
      return <div>Loading...</div>;
    }

    return auth.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};
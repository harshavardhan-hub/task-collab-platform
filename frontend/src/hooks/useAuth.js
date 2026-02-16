import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';
import { useState } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, updateUser, logout: logoutStore } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (email, password, fullName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.signup({ email, password, fullName });
      
      // Auto login after signup
      const loginResponse = await authAPI.login({ email, password });
      setAuth(loginResponse.data.user, loginResponse.data.token);
      
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });
      setAuth(response.data.user, response.data.token);
      
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
    navigate('/login');
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.updateProfile(data);
      updateUser(response.data.user);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
  };
};

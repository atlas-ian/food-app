'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '@/lib/api/auth';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const user = await authAPI.getProfile();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    try {
      const { user, token } = await authAPI.login(email, password);
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { user, token } = await authAPI.register(userData);
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import axios from 'axios';
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAILURE } from './types';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/users/login', credentials, config);
    
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: USER_LOGIN_FAILURE, payload: message });
    throw new Error(message);
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/users/register', userData, config);
    
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: USER_REGISTER_FAILURE, payload: message });
    throw new Error(message);
  }
};
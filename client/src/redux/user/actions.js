@@ .. @@
 import axios from 'axios';
 import { USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_SUCCESS } from './types';
 
 export const loginUser = (credentials) => async (dispatch) => {
   try {
     const { data } = await axios.post('/api/users/login', credentials);
     dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
     localStorage.setItem('userInfo', JSON.stringify(data));
   } catch (error) {
     console.error('Login failed', error.response?.data?.message || error.message);
   }
 };
 
 export const logoutUser = () => (dispatch) => {
   localStorage.removeItem('userInfo');
   dispatch({ type: USER_LOGOUT });
 };
-export const registerUser = (name, email, password) => async (dispatch) => {
-  const { data } = await axios.post('/api/register', {
-    name,
-    email,
-    password,
-  });
+
+export const registerUser = (userData) => async (dispatch) => {
+  try {
+    const { data } = await axios.post('/api/users/register', userData);
+    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
+    localStorage.setItem('userInfo', JSON.stringify(data));
+  } catch (error) {
+    console.error('Registration failed', error.response?.data?.message || error.message);
+  }
+};
-
-  dispatch({
-    type: USER_REGISTER_SUCCESS,
-    payload: data,
-  });
-
-  localStorage.setItem('userInfo', JSON.stringify(data));
-};
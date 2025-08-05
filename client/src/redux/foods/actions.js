// client/src/redux/foods/actions.js
import axios from 'axios';

export const FETCH_FOODS_REQUEST = 'FETCH_FOODS_REQUEST';
export const FETCH_FOODS_SUCCESS = 'FETCH_FOODS_SUCCESS';
export const FETCH_FOODS_FAILURE = 'FETCH_FOODS_FAILURE';

export const fetchFoods = () => async dispatch => {
  console.log('fetchFoods action called');
  dispatch({ type: FETCH_FOODS_REQUEST });
  try {
    console.log('Making API call to /api/foods');
    const { data } = await axios.get('/api/foods');
    console.log('API response:', data);
    dispatch({ type: FETCH_FOODS_SUCCESS, payload: data });
  } catch (err) {
    console.error('API error:', err);
    dispatch({ 
      type: FETCH_FOODS_FAILURE, 
      payload: err.response?.data?.message || err.message 
    });
  }
};
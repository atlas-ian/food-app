// client/src/redux/foods/actions.js
import axios from 'axios';

export const FETCH_FOODS_REQUEST = 'FETCH_FOODS_REQUEST';
export const FETCH_FOODS_SUCCESS = 'FETCH_FOODS_SUCCESS';
export const FETCH_FOODS_FAILURE = 'FETCH_FOODS_FAILURE';

export const fetchFoods = () => async dispatch => {
  dispatch({ type: FETCH_FOODS_REQUEST });
  try {
    const { data } = await axios.get(`/api/foods`);
    dispatch({ type: FETCH_FOODS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_FOODS_FAILURE, payload: err.message });
  }
};

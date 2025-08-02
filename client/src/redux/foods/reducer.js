// client/src/redux/foods/reducer.js
import {
  FETCH_FOODS_REQUEST,
  FETCH_FOODS_SUCCESS,
  FETCH_FOODS_FAILURE,
} from './actions';

const initialState = {
  loading: false,
  items:   [],
  error:   null,
};

export const foodsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FOODS_REQUEST:
      return { ...state, loading: true };
    case FETCH_FOODS_SUCCESS:
      return { loading: false, items: action.payload, error: null };
    case FETCH_FOODS_FAILURE:
      return { loading: false, items: [], error: action.payload };
    default:
      return state;
  }
};

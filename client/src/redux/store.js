// client/src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { cartReducer } from './cart/reducer';
import { foodsReducer } from './foods/reducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  foods: foodsReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

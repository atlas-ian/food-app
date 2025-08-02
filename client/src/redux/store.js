// client/src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { foodsReducer }     from './foods/reducer';

const rootReducer = combineReducers({
  foods: foodsReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

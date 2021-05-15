import { createStore } from 'redux';
import { reducer } from './reducers';

const initialState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: '',
};

const store = createStore(reducer, initialState);
export default store
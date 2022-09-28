/*
 *
 * Homepage reducer
 *
 */

import { DEFAULT_ACTION, FETCH_STORE_CATEGORIES } from './constants';

const initialState = {
  categories: [],
  storeCategories: [],
};

const homepageReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case DEFAULT_ACTION:
      return newState;
    case FETCH_STORE_CATEGORIES:
        return {
          ...state,
          categories: action.payload
        };
    default:
      return state;
  }
};

export default homepageReducer;

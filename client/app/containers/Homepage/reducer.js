/*
 *
 * Homepage reducer
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_STORE_CATEGORIES,
  FETCH_MARKETING,
  FETCH_SHOP,
} from "./constants";

const initialState = {
  categories: [],
  marketing: [],
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
        categories: action.payload,
      };
    case FETCH_MARKETING:
      return {
        ...state,
        marketing: action.payload,
      };
    case FETCH_SHOP:
      return {
        ...state,
        shop: action.payload,
      };
    default:
      return state;
  }
};

export default homepageReducer;

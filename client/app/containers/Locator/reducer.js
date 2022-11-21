/*
 *
 * LOCATOR reducer
 *
 */

import { FETCH_LOCATOR, SET_LOCATOR_LOADING } from "./constants";

const initialState = {
  locators: [],
  isLoading: false,
};

const locatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOCATOR:
      return {
        ...state,
        locators: action.payload,
      };
    case SET_LOCATOR_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export default locatorReducer;

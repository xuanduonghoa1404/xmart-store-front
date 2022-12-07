/*
 *
 * Navigation actions
 *
 */

import axios from 'axios';
import handleError from '../../utils/error';
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  FETCH_MARKETING,
  FETCH_LOCATOR,
  SUGGESTIONS_CLEAR_REQUEST,
} from "./constants";

export const toggleMenu = () => {
  return {
    type: TOGGLE_MENU,
  };
};

export const toggleCart = () => {
  return {
    type: TOGGLE_CART,
  };
};

export const toggleBrand = () => {
  return {
    type: TOGGLE_BRAND,
  };
};

export const onSearch = (v) => {
  return {
    type: SEARCH_CHANGE,
    payload: v,
  };
};

export const onSuggestionsFetchRequested = (value) => {
  const inputValue = value.value.trim().toLowerCase();

  return async (dispatch, getState) => {
    try {
      if (inputValue && inputValue.length % 3 === 0) {
        const response = await axios.get(
          `/api/product/list/search/${inputValue}`
        );
        dispatch({
          type: SUGGESTIONS_FETCH_REQUEST,
          payload: response.data.products,
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const onSuggestionsClearRequested = () => {
  return {
    type: SUGGESTIONS_CLEAR_REQUEST,
    payload: [],
  };
};

export const fetchLocator = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLocatorLoading(true));
      const response = await axios.get(`/api/locator`);

      dispatch({ type: FETCH_LOCATOR, payload: response.data });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setLocatorLoading(false));
    }
  };
};

// fetch Marketing api
export const fetchMarketing = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/marketing`);

      dispatch({
        type: FETCH_MARKETING,
        payload: response.data,
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
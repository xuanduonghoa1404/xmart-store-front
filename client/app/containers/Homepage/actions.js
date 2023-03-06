/*
 *
 * Homepage actions
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_STORE_CATEGORIES,
  FETCH_MARKETING,
  FETCH_SHOP,
} from "./constants";

import { success } from "react-notification-system-redux";
import axios from "axios";

import handleError from "../../utils/error";
export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION,
  };
};

// fetch store categories api
export const fetchStoreCategories = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/product/list/select`);

      dispatch({
        type: FETCH_STORE_CATEGORIES,
        payload: response.data.products,
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch store categories api
export const fetchShop = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/shop/shop`);

      dispatch({
        type: FETCH_SHOP,
        payload: response.data,
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
// fetch store categories api
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
/*
 *
 * LOCATOR actions
 *
 */

import { success } from "react-notification-system-redux";
import axios from "axios";

import { FETCH_LOCATOR, SET_LOCATOR_LOADING } from "./constants";
import handleError from "../../utils/error";

export const setLocatorLoading = (value) => {
  return {
    type: SET_LOCATOR_LOADING,
    payload: value,
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

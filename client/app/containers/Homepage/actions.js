/*
 *
 * Homepage actions
 *
 */

import { DEFAULT_ACTION, FETCH_STORE_CATEGORIES } from './constants';

export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION
  };
};

// fetch store categories api
export const fetchStoreCategories = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/product/list/select`);
      console.log('response', response);

      dispatch({
        type: FETCH_STORE_CATEGORIES,
        payload: response.data.products
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
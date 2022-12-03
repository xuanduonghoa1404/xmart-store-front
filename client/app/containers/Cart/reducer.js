/*
 *
 * Cart reducer
 *
 */

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_QTY,
  DECREASE_QTY,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

const initialState = {
  cartItems: [],
  itemsInCart: [],
  cartTotal: 0,
  cartId: ''
};

const cartReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case ADD_TO_CART:
      let itemId = state.cartItems.findIndex(
        x => x._id == action.payload._id
      );
      if (itemId === -1) {
        newState = {
          ...state,
          cartItems: [...state.cartItems, action.payload],
          itemsInCart: [...state.itemsInCart, action.payload._id],
        };
      } else {
      }
    newState = {
      ...state,
      cartItems: [...state.cartItems, action.payload],
      itemsInCart: [...state.itemsInCart, action.payload._id]
    };
      localStorage.setItem('cart_items', JSON.stringify(newState.cartItems));
      localStorage.setItem(
        'items_in_cart',
        JSON.stringify(newState.itemsInCart)
      );
      return newState;
    case REMOVE_FROM_CART:
      let itemIndex = state.cartItems.findIndex(
        x => x._id == action.payload._id
      );
      newState = {
        ...state,
        cartItems: [
          ...state.cartItems.slice(0, itemIndex),
          ...state.cartItems.slice(itemIndex + 1)
        ],
        itemsInCart: [
          ...state.itemsInCart.slice(0, itemIndex),
          ...state.itemsInCart.slice(itemIndex + 1)
        ]
      };

      localStorage.setItem('cart_items', JSON.stringify(newState.cartItems));
      localStorage.setItem(
        'items_in_cart',
        JSON.stringify(newState.itemsInCart)
      );
      return newState;
    case HANDLE_CART_TOTAL:
      newState = {
        ...state,
        cartTotal: action.payload
      };

      localStorage.setItem('cart_total', newState.cartTotal);
      return newState;
    case INCREASE_QTY:
      let itemIdex = state.cartItems.findIndex(
        x => x._id == action.payload._id
      );
      let item = state.cartItems[itemIdex];
      let price = item?.final_price || item.price;
      let newItem = {
        ...item,
        quantity: item.quantity + 1,
        totalPrice: (item.quantity + 1) * price,
      };
      state.cartItems[itemIdex] = newItem;
      newState = {
        ...state,
        cartItems: [
          ...state.cartItems
        ],
        itemsInCart: [
          ...state.cartItems
        ]
      };

      localStorage.setItem('cart_items', JSON.stringify(newState.cartItems));
      localStorage.setItem(
        'items_in_cart',
        JSON.stringify(newState.itemsInCart)
      );
      return newState;
    case DECREASE_QTY:
        let itemIde = state.cartItems.findIndex(
          x => x._id == action.payload._id
        );
      let itemDecrease = state.cartItems[itemIde];
      let priceItem = itemDecrease?.final_price || itemDecrease.price;
      let newItemDecrease = {
        ...itemDecrease,
        quantity: itemDecrease.quantity - 1,
        totalPrice: (itemDecrease.quantity - 1) * priceItem,
      };
        state.cartItems[itemIde] = newItemDecrease;
        newState = {
          ...state,
          cartItems: [
            ...state.cartItems
          ],
          itemsInCart: [
            ...state.cartItems
          ]
        };
  
        localStorage.setItem('cart_items', JSON.stringify(newState.cartItems));
        localStorage.setItem(
          'items_in_cart',
          JSON.stringify(newState.itemsInCart)
        );
        return newState;
    case HANDLE_CART:
      newState = {
        ...state,
        cartItems: action.payload.cartItems,
        itemsInCart: action.payload.itemsInCart,
        cartTotal: action.payload.cartTotal,
        cartId: action.payload.cartId
      };
      return newState;
    case SET_CART_ID:
      newState = {
        ...state,
        cartId: action.payload
      };
      localStorage.setItem('cart_id', newState.cartId);
      return newState;
    case CLEAR_CART:
      newState = {
        ...state,
        cartItems: [],
        itemsInCart: [],
        cartTotal: 0,
        cartId: ''
      };
      return newState;

    default:
      return state;
  }
};

export default cartReducer;

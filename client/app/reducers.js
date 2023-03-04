/*
 *
 * reducers.js
 * reducers configuration
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as notifications } from 'react-notification-system-redux';

// import reducers
import applicationReducer from './containers/Application/reducer';
import homepageReducer from './containers/Homepage/reducer';
import signupReducer from './containers/Signup/reducer';
import loginReducer from './containers/Login/reducer';
import forgotPasswordReducer from './containers/ForgotPassword/reducer';
import navigationReducer from './containers/Navigation/reducer';
import authenticationReducer from './containers/Authentication/reducer';
import cartReducer from './containers/Cart/reducer';
import newsletterReducer from './containers/Newsletter/reducer';
import dashboardReducer from './containers/Dashboard/reducer';
import accountReducer from './containers/Account/reducer';
import addressReducer from './containers/Address/reducer';
import resetPasswordReducer from "./containers/ResetPassword/reducer";
import productReducer from './containers/Product/reducer';
import categoryReducer from "./containers/Category/reducer";
import navigationMenuReducer from "./containers/NavigationMenu/reducer";
import shopReducer from "./containers/Shop/reducer";
import contactReducer from "./containers/Contact/reducer";
import orderReducer from "./containers/Order/reducer";
import locatorReducer from "./containers/Locator/reducer";
import checkoutReducer from "./containers/CheckoutPage/reducer";

const createReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    notifications,
    application: applicationReducer,
    homepage: homepageReducer,
    signup: signupReducer,
    login: loginReducer,
    forgotPassword: forgotPasswordReducer,
    navigation: navigationReducer,
    authentication: authenticationReducer,
    cart: cartReducer,
    newsletter: newsletterReducer,
    dashboard: dashboardReducer,
    account: accountReducer,
    address: addressReducer,
    resetPassword: resetPasswordReducer,
    product: productReducer,
    category: categoryReducer,
    menu: navigationMenuReducer,
    shop: shopReducer,
    contact: contactReducer,
    order: orderReducer,
    locator: locatorReducer,
    checkout: checkoutReducer,
  });

export default createReducer;

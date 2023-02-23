/**
 *
 * CheckoutPage
 *
 */

import React from "react";

import { connect } from "react-redux";

import actions from "../../actions";
import "./CheckoutSection.css";
import OrderDetails from "../../components/Manager/OrderDetails";
import OrderSummary from "../../components/Manager/OrderSummary";
import NotFound from "../../components/Common/NotFound";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import YourOrders from "./YourOrders";
import ShippingAddress from "./ShippingAddress";

class CheckoutPage extends React.PureComponent {
  // componentDidMount() {
  //   const id = this.props.match.params.id;
  //   this.props.fetchOrder(id);
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.match.params.id !== prevProps.match.params.id) {
  //     const id = this.props.match.params.id;
  //     this.props.fetchOrder(id);
  //   }
  // }

  render() {
    const {
      history,
      order,
      user,
      isLoading,
      cart,
      cancelOrder,
      updateOrderItemStatus,
      locators,
      formErrors,
      addressEditChange,
      shippingAddressChange,
      locatorChange,
      defaultChange,
      updateAddress,
      selectAddress,
      shippingAddress,
      placeOrder,
    } = this.props;

    return (
      <div className="order-page">
        {isLoading ? (
          <LoadingIndicator backdrop />
        ) : (
          <div className="checkout-section">
            <div className="container-xxl">
              <h1>Thanh toán</h1>
            </div>
            <div className="container-xxl mt-5">
              <div className="row justify-content-between">
                <div className="col-12 col-lg-5 col-xl-6 form mb-5 mb-lg-0">
                  <ShippingAddress
                    user={user}
                    locators={locators}
                    formErrors={formErrors}
                    addressChange={addressEditChange}
                    shippingAddressChange={shippingAddressChange}
                    locatorChange={locatorChange}
                    shippingAddress={shippingAddress}
                    selectAddress={selectAddress}
                    placeOrder={placeOrder}
                  />
                </div>
                <div className="col-12 col-lg-6 col-xl-5 orders ">
                  <YourOrders products={cart.cartItems} />
                  <OrderSummary cart={cart} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.account.user,
    order: state.order.order,
    cart: state.cart,
    isLoading: state.order.isLoading,
    locators: state.locator.locators,
    shippingAddress: state.address.shippingAddress,
  };
};

export default connect(mapStateToProps, actions)(CheckoutPage);

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
    console.log("CheckoutPage locators", locators);
    let newLocators = [
      {
        status: true,
        _id: "62933b3fe744ac34445c4fc0",
        name: "37 Lê Thanh Nghị",
        address: "37 Lê Thanh Nghị, Bách Khoa, Hai Bà Trưng HN",
        storeID: "HN1",
        createdAt: "2022-05-29T09:22:07.297Z",
        updatedAt: "2022-12-24T03:47:15.953Z",
        __v: 0,
        lat: 21.00146,
        lng: 105.84651,
      },
      {
        status: true,
        _id: "62933e07c224b41fc48a1182",
        name: "350 Giải Phóng",
        address:
          "350 Đường Giải Phóng, Phường Phương Liệt, Quận Thanh Xuân, Hà Nội",
        storeID: "HN2",
        createdAt: "2022-05-29T09:33:59.562Z",
        updatedAt: "2022-05-29T09:33:59.562Z",
        __v: 0,
        lat: 20.98853,
        lng: 105.84075,
      },
    ];
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
                    locators={locators.length ? locators : newLocators}
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

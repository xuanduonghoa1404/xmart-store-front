/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';

const Checkout = props => {
  const {
    authenticated,
    handleShopping,
    handleCheckout,
    placeOrder,
    handleLogin,
    redirectCheckoutPage,
  } = props;

  return (
    <div className="easy-checkout">
      <div className="checkout-actions">
        <Button
          variant="primary"
          text="Tiếp tục mua hàng"
          onClick={() => handleShopping()}
        />
        {authenticated ? (
          <Button
            variant="primary"
            text="Đi đến thanh toán"
            onClick={() => redirectCheckoutPage()}
          />
        ) : (
          <Button
            variant="primary"
            text="Đăng nhập để thanh toán"
            onClick={() => handleCheckout()}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;

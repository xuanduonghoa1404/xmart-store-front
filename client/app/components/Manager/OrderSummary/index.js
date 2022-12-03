/**
 *
 * OrderSummary
 *
 */

import React from 'react';

import { Col } from 'reactstrap';

const OrderSummary = props => {
  const { order, cart } = props;

  return (
    <Col className="order-summary pt-3">
      <h2>Chi tiết thanh toán</h2>
      <div className="d-flex align-items-center summary-item">
        <p className="summary-label">Tổng đơn</p>
        <p className="summary-value ml-auto">
          {order ? order.total : cart.cartTotal} ₫
        </p>
      </div>
      {/* <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Est. Sales Tax</p>
        <p className='summary-value ml-auto'>{order.totalTax} ₫</p>
      </div> */}

      <div className="d-flex align-items-center summary-item">
        <p className="summary-label">Phí vận chuyển</p>
        <p className="summary-value ml-auto">0 ₫</p>
      </div>

      <hr />
      <div className="d-flex align-items-center summary-item">
        <p className="summary-label">Tổng thanh toán</p>
        <p className="summary-total ml-auto">
          {order ? order.totalWithTax : cart.cartTotal} ₫
        </p>
      </div>
    </Col>
  );
};

export default OrderSummary;

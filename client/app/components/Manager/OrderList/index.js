/**
 *
 * OrderList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '../../../helpers/date';
const ORDER_STATUS = new Map();
ORDER_STATUS.set("Not processed", { color: "red", valueVN: "Chưa xử lý" });
ORDER_STATUS.set("Processing", { color: "orange", valueVN: "Đã xác nhận" });
ORDER_STATUS.set("Shipped", { color: "blue", valueVN: "Đang vận chuyển" });
ORDER_STATUS.set("Delivered", { color: "green", valueVN: "Đã giao hàng" });
ORDER_STATUS.set("Cancelled", { color: "grey", valueVN: "Đã hủy" });
const OrderList = (props) => {
  const { orders } = props;

  const renderFirstItem = (order) => {
    if (order.products) {
      const product = order.products[0].product;
      return (
        <img
          className="item-image"
          src={`${
            product && product?.photo
              ? product?.photo
              : "/images/placeholder-image.png"
          }`}
        />
      );
    } else {
      return <img className="item-image" src="/images/placeholder-image.png" />;
    }
  };
  const STATUS_ORDER = {
    0: "Chờ xác nhận",
    1: "Đã xác nhận",
    2: "Đang giao hàng",
    3: "Đã giao hàng",
    4: "Đã hủy",
  };

  return (
    <div className="order-list">
      {orders.map((order, index) => (
        <div key={index} className="order-box">
          <Link to={`/order/${order._id}`} className="d-block box-link">
            <div className="d-flex flex-column flex-lg-row mb-3">
              <div className="order-first-item p-lg-3">
                {renderFirstItem(order)}
              </div>
              <div className="d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3">
                <div className="order-details">
                  <div className="mb-1">
                    <span>Trạng thái</span>
                    {order?.products ? (
                      <span className="order-label order-status ml-1">
                        {ORDER_STATUS.get(order?.status || "")?.valueVN}
                      </span>
                    ) : (
                      <span className="order-label order-status ml-1">{` Chưa xác nhận`}</span>
                    )}
                  </div>
                  <div className="mb-1">
                    <span>Mã đơn hàng #</span>
                    <span className="order-label">{` ${order._id}`}</span>
                  </div>
                  <div className="mb-1">
                    <span>Ngày đặt hàng</span>
                    <span className="order-label">{` ${formatDate(
                      order.created
                    )}`}</span>
                  </div>
                  <div className="mb-1">
                    <span>Tổng đơn hàng</span>
                    <span className="order-label">{` ${order?.totalWithTax} đ`}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OrderList;

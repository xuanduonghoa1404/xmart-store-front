/**
 *
 * OrderItems
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col, DropdownItem } from 'reactstrap';

import Button from "../../Common/Button";

const statusMap = new Map();
statusMap.set("Not processed", "Chưa xử lý");
statusMap.set("Processing", "Đã xử lý");
statusMap.set("Shipped", "Đang vận chuyển");
statusMap.set("Delivered", "Đã giao hàng");
statusMap.set("Cancelled", "Đã hủy");
const OrderItems = props => {
  const { order, user, updateOrderItemStatus } = props;

  const renderPopoverContent = (item) => {
    const statuses = [
      "Not processed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        {statuses.map((s, i) => (
          <DropdownItem
            key={`${s}-${i}`}
            className={s === item?.status ? "active" : ""}
            onClick={() => updateOrderItemStatus(item._id, s)}
          >
            {s}
          </DropdownItem>
        ))}
      </div>
    );
  };

  return (
    <div className="order-items pt-3">
      <h2>Đơn hàng</h2>
      <Row>
        {order.products.map((item, index) => (
          <Col xs="12" key={index} className="item">
            <div className="order-item-box">
              <div className="d-flex justify-content-between flex-column flex-md-row">
                <div className="d-flex align-items-center box">
                  <img
                    className="item-image"
                    src={`${
                      item.product && item.product.photo
                        ? item.product.photo
                        : "/images/placeholder-image.png"
                    }`}
                  />
                  <div className="d-md-flex flex-1 align-items-start ml-4 item-box">
                    <div className="item-details">
                      {item.product ? (
                        <>
                          <Link
                            to={`/product/${item.product?.slug}`}
                            className="item-link"
                          >
                            <h4 className="d-block item-name one-line-ellipsis">
                              {item.product?.name}
                            </h4>
                          </Link>
                          {/* <div className="d-flex align-items-center justify-content-between">
                            <span className="price">
                              {item.purchasePrice || item.product.price} đ
                            </span>
                          </div> */}
                        </>
                      ) : (
                        <h4>Không có</h4>
                      )}
                    </div>
                    <div className="d-flex justify-content-between flex-wrap d-md-none mt-1">
                      <p className="mb-1 mr-4">
                        Đơn giá
                        <span className="order-label order-status">{` ${item.price}`}</span>
                      </p>
                      <p className="mb-1 mr-4">
                        Số lượng
                        <span className="order-label">{` ${item.quantity}`}</span>
                      </p>
                      <p>
                        Thành tiền
                        <span className="order-label">{`${item.totalPrice}đ`}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-none d-md-flex justify-content-between align-items-center box">
                  <div className="text-center">
                    <p className="order-label order-status">
                      {item.purchasePrice}đ
                    </p>
                    {/* <p>Đơn giá</p> */}
                  </div>

                  <div className="text-center">
                    <p className="order-label">{`x${item.quantity}`}</p>
                    {/* <p>Số lượng</p> */}
                  </div>

                  <div className="text-center">
                    <p className="order-label">{`${item.totalPrice}đ`}</p>

                    {/* <p>Thành tiền</p> */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OrderItems;

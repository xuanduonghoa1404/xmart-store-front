/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { formatDate } from '../../../helpers/date';
import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';
const statusMap = new Map();
statusMap.set("Not processed", "Chưa xử lý");
statusMap.set("Processing", "Đã xử lý");
statusMap.set("Shipped", "Đang vận chuyển");
statusMap.set("Delivered", "Đã giao hàng");
statusMap.set("Cancelled", "Đã hủy");
const OrderMeta = (props) => {
  const { order, cancelOrder, onBack } = props;

  const renderMetaAction = () => {
    const isNotDelivered =
      order.products.filter((i) => i.status === "Delivered").length < 1;

    if (isNotDelivered) {
      return <Button size="sm" text="Hủy đơn hàng" onClick={cancelOrder} />;
    }
  };

  return (
    <div className="order-meta">
      <div className="d-flex align-items-center justify-content-between mb-3 title">
        <h2 className="mb-0">Chi tiết đơn hàng</h2>
        <Button
          variant="link"
          icon={<ArrowBackIcon />}
          size="sm"
          text="Trở về"
          onClick={onBack}
        ></Button>
      </div>

      <Row>
        <Col xs="12" md="10">
          <Row>
            <Col xs="2">
              <p className="one-line-ellipsis">Mã đơn hàng</p>
            </Col>
            <Col xs="10">
              <span className="order-label one-line-ellipsis">{` ${order._id}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs="2">
              <p className="one-line-ellipsis">Ngày đặt hàng</p>
            </Col>
            <Col xs="10">
              <span className="order-label one-line-ellipsis">{` ${formatDate(
                order.created
              )}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs="2">
              <p className="one-line-ellipsis">Địa chỉ</p>
            </Col>
            <Col xs="10">
              <span className="order-label one-line-ellipsis">
                {`${order?.name || ""}, ${order?.phone || ""}, ${
                  order?.address
                } ${order?.city}, ${order?.country}, ${order?.zipCode}`}
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs="2">
              <p className="one-line-ellipsis">Trạng thái</p>
            </Col>
            <Col xs="10">
              <span className="order-label one-line-ellipsis">
                {statusMap.get(order.status)}
              </span>
            </Col>
          </Row>
        </Col>
        <Col xs="12" md="2" className="text-left text-md-right">
          {renderMetaAction()}
        </Col>
      </Row>
    </div>
  );
};

export default OrderMeta;

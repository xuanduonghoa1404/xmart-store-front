import React from "react";

const YourOrders = (props) => {
  const { products } = props;

  const productsHandler = () =>
    products.map((product, index) => (
      <div
        className="product border-bottom pb-2 d-flex justify-content-between align-items-center mb-4"
        key={product._id + index}
      >
        <div className="left d-flex align-items-center">
          <img
            className="me-3"
            src={product.photo}
            alt={product.name}
            width="64px"
            height="64px"
            style={{ objectFit: "cover" }}
          />
          <p className="mb-0 me-2 d-flex" style={{ flexDirection: "column" }}>
            <span>{product.name}</span>
            <span>
              {product.price}₫ x {product.quantity}
            </span>
          </p>
        </div>
        <div className="right ms-5">{+product.price * product.quantity}₫</div>
      </div>
    ));

  return (
    <div className="yourOrders">
      <h3 className="fw-bold mb-4">Đơn hàng</h3>
      <div className="parent">
        <div className="d-flex justify-content-between py-3 mb-3">
          <h6 className="mb-0">Sản phẩm</h6>
          <h6 className="mb-0">Tổng số tiền</h6>
        </div>
        <div className="products mb-3">{productsHandler()}</div>
      </div>
    </div>
  );
};

export default YourOrders;

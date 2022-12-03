/**
 *
 * CartList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Button from '../../Common/Button';
import "./CartSection.css";
const CartList = props => {
  const { cartItems, handleRemoveFromCart, increaseQtyItemFromCart, decreaseQtyItemFromCart } = props;

  console.log(cartItems);
  const handleProductClick = () => {
    props.toggleCart();
  };
  const itemHandler = () =>
    cartItems.map(({ id, imgsrc, amount, price, name, color, size }, idx) => (
      <div className="product rounded  mb-4 position-relative" key={idx}>
        <div
          className="deleteItem position-absolute pointer"
        // onClick={() => action(removeItemFunc({ title, color, size }))}
        >
          {/* <Icon prefix={"fa-solid"} icon={"fa-xmark"} /> */}
        </div>
        <div className="overflow-hidden d-flex">
          <Link to={`/Shopping-App/products/product/${id}`}>
            <div
              className="img rounded overflow-hidden me-4"
            // onClick={() => {
            //   action(overLayFunc());
            //   action(viewDetails());
            //   action(productCartFunc(id));
            // }}
            >
              <img
                // src={require(`../../Components/Products/${imgsrc}`)}
                alt="img"
              />
            </div>
          </Link>
          <div className="content d-flex flex-column justify-content-between">
            <p className="mb-0">
              <span>{name} - </span>
              <span>
                {/* {color} , {size} */}
              </span>
            </p>
            <p className="mb-3">unit price : {price}</p>
            <div className="d-flex bot justify-content-between align-items-center">
              <div className="count d-flex">
                <button
                  className="decrease w-25"
                // onClick={() => action(decreaseFunc(idx))}
                >
                  -
                </button>
                <p className="amount w-50 mb-0">{amount}</p>
                <button
                  className="increase w-25"
                // onClick={() => action(increaseFunc(idx))}
                >
                  +
                </button>
              </div>
              <p className="mb-0 fw-bolder">
                {/* {`$${parseFloat(price.slice(1, price.length) * amount).toFixed(
                2
              )}`} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  return (
    <div className="cart-list aside cartSection">
      {cartItems.map((item, index) => (
        <div key={index} className="item-box products">
          <div className="item-details product ">
            <Container className="content">
              <Row className="mb-2 align-items-center">
                <Col xs="10" className="pr-0">
                  <div className="d-flex align-items-center">
                    <img
                      className="item-image mr-2"
                      src={`${
                        item.photo
                          ? item.photo
                          : "/images/placeholder-image.png"
                      }`}
                    />

                    <Link
                      to={`/product/${item.slug}`}
                      className="item-link one-line-ellipsis"
                      onClick={handleProductClick}
                    >
                      <h1 className="item-name one-line-ellipsis">
                        {item.name}
                      </h1>
                    </Link>
                  </div>
                </Col>
                <Col xs="2" className="text-right">
                  <Button
                    borderless
                    variant="empty"
                    ariaLabel={`remove ${item.name} from cart`}
                    icon={<i className="icon-trash" aria-hidden="true" />}
                    onClick={() => handleRemoveFromCart(item)}
                  />
                </Col>
              </Row>
              <Row className="mb-2 align-items-center">
                <Col xs="7">
                  <p className="item-label">Giá</p>
                </Col>
                <Col xs="5" className="text-right">
                  <p className="value price">{`${
                    item?.final_price ? item?.final_price : item?.price
                  } ₫`}</p>
                </Col>
              </Row>
              {/* <Row className='mb-2 align-items-center'>
                <Col xs='9'>
                  <p className='item-label'>Số lượng</p>
                </Col>
                <Col xs='3' className='text-right'>
                  <p className='value quantity'>{` ${item.quantity}`}</p>
                </Col>
                
              </Row> */}
              <Row className="mb-2 align-items-center">
                <div className="d-flex bot justify-content-between align-items-center">
                  <div className="count d-flex">
                    <button
                      className="decrease w-25"
                      onClick={() => decreaseQtyItemFromCart(item)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <p className="amount w-50 mb-0">{item.quantity}</p>
                    <button
                      className="increase w-25"
                      onClick={() => increaseQtyItemFromCart(item)}
                    >
                      +
                    </button>
                  </div>
                  <p className="mb-0 fw-bolder">
                    {/* {`$${parseFloat(price.slice(1, price.length) * amount).toFixed(
                2
              )}`} */}
                    {`${item?.totalPrice} ₫`}
                  </p>
                </div>
              </Row>
            </Container>
          </div>
        </div>
      ))}
      {/* {itemHandler} */}
    </div>
  );
};

export default CartList;

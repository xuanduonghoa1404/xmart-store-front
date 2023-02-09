/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import FlashSaleItem from "../FlashSale";
import Button from "../../../components/Common/Button";
import Input from "../../../components/Common/Input";
import { BagIcon } from "../../../components/Common/Icon";
const ProductList = (props) => {
  const {
    products,
    updateWishlist,
    authenticated,
    handleAddToCart,
    productShopChange,
    completedCountDown,
  } = props;
  // function completedCountDown() {
  //   console.log("completedCountDown", new Date());
  // }
  return (
    <div className="product-list">
      {products.map((product, index) => (
        <div key={index} className="mb-3 mb-md-0">
          <div className="product-container">
            <div className="item-box">
              <div className="add-wishlist-box"></div>

              <div className="item-link">
                <Link
                  to={`/product/${product.slug}`}
                  className="d-flex flex-column h-100"
                >
                  <div className="item-image-container">
                    <div className="item-image-box">
                      <img
                        className="item-image"
                        src={`${
                          product.photo
                            ? product.photo
                            : "/images/placeholder-image.png"
                        }`}
                      />
                      {product.final_price ? (
                        <p className="discount-price">
                          -
                          {((product.price - product.final_price) * 100) /
                            product.price}
                          %
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="item-body">
                    <div className="item-details p-3">
                      <FlashSaleItem
                        product={product}
                        completedCountDown={completedCountDown}
                      />
                      <h1 className="item-name">{product.name}</h1>

                      <p className="item-desc mb-0">ĐVT: {product.uom}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer">
                    {product.final_price ? (
                      <>
                        <p className="special-price mb-0">
                          {product.final_price} ₫
                        </p>
                        <p className="old-price mb-0">{product.price} ₫</p>
                      </>
                    ) : (
                      <p className="price mb-0">{product.price} ₫</p>
                    )}
                  </div>
                </Link>
                {/* <Input
                        type={'number'}
                        // error={shopFormErrors['quantity']}
                        label={'Số lượng'}
                        name={'quantity'}
                        decimals={false}
                        min={1}
                        // max={product.inventory}
                        placeholder={'Số lượng'}
                        // disabled={
                        //   product.inventory <= 0
                        // }
                        value={products.quantity || 1}
                        onInputChange={(name, value) => {
                          productShopChange(name, value);
                        }}
                      /> */}
                <Button
                  variant="primary"
                  disabled={product.quantity <= 0}
                  text="Thêm vào giỏ hàng"
                  className="bag-btn"
                  icon={<BagIcon />}
                  onClick={() => handleAddToCart(product)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

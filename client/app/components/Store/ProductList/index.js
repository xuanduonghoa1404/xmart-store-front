/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';
import Button from '../../../components/Common/Button';
import Input from '../../../components/Common/Input';
import { BagIcon } from '../../../components/Common/Icon';
const ProductList = props => {
  const { products, updateWishlist, authenticated, handleAddToCart, productShopChange} = props;

  return (
    <div className='product-list'>
      {products.map((product, index) => (
        <div key={index} className='mb-3 mb-md-0'>
          <div className='product-container'>
            <div className='item-box'>
              <div className='add-wishlist-box'>
                <AddToWishList
                  product={product}
                  updateWishlist={updateWishlist}
                  authenticated={authenticated}
                />
              </div>

              <div className='item-link'>
                <Link
                  to={`/product/${product.slug}`}
                  className='d-flex flex-column h-100'
                >
                  <div className='item-image-container'>
                    <div className='item-image-box'>
                      <img
                        className='item-image'
                        src={`${
                          product.photo
                            ? product.photo
                            : '/images/placeholder-image.png'
                        }`}
                      />
                    </div>
                  </div>
                  <div className='item-body'>
                    <div className='item-details p-3'>
                      <h1 className='item-name'>{product.name}</h1>
                      {product.brand && Object.keys(product.brand).length > 0 && (
                        <p className='by'>
                          By <span>{product.brand.name}</span>
                        </p>
                      )}
                      <p className='item-desc mb-0'>ĐVT: {product.uom}</p>
                    </div>
                  </div>
                  <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                    <p className='price mb-0'>{product.price} ₫</p>
                    
                    {product.totalReviews > 0 && (
                      <p className='mb-0'>
                        <span className='fs-16 fw-1 mr-1'>
                          {parseFloat(product?.averageRating).toFixed(1)}
                        </span>
                        <span
                          className={`fa fa-star ${
                            product.totalReviews !== 0 ? 'checked' : ''
                          }`}
                          style={{ color: '#ffb302' }}
                        ></span>
                      </p>
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
                          variant='primary'
                          disabled={
                            product.quantity <= 0
                          }
                          text='Thêm vào giỏ hàng'
                          className='bag-btn'
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

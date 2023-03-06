/**
 *
 * ProductsShop
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class ProductsShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts(slug);
  }

  render() {
    const {
      products,
      isLoading,
      authenticated,
      handleAddToCart,
      productShopChange,
      updateProductAfterFlashSale,
    } = this.props;

    return (
      <div className="products-shop">
        {isLoading && <LoadingIndicator />}
        {products && products.length > 0 && (
          <ProductList
            products={products}
            authenticated={authenticated}
            handleAddToCart={handleAddToCart}
            productShopChange={productShopChange}
            completedCountDown={updateProductAfterFlashSale}
          />
        )}
        {!isLoading && products && products.length <= 0 && (
          <NotFound message="Không tìm thấy sản phẩm." />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(ProductsShop);

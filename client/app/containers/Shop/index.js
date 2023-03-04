/**
 *
 * Shop
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import ProductsShop from '../ProductsShop';
import BrandsShop from '../BrandsShop';
import CategoryShop from '../CategoryShop';

import Page404 from "../../components/Common/Page404";
import Pagination from "../../components/Common/Pagination";

class Shop extends React.PureComponent {
  componentDidMount() {
    document.body.classList.add("shop-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("shop-page");
  }

  render() {
    const { products, advancedFilters, filterProducts } = this.props;
    const { totalProducts, pageNumber, pages, order } = advancedFilters;

    return (
      <div className="shop">
        <Row xs="12">
          <Col
            xs="12"
            xs={{ size: 12, order: 2 }}
            sm={{ size: 12, order: 2 }}
            md={{ size: 12, order: 2 }}
            lg={{ size: 12, order: 2 }}
          >
            <Row className="align-items-center">
              <Col
                xs="6"
                xs={{ size: 12, order: 1 }}
                sm={{ size: 12, order: 1 }}
                md={{ size: 5, order: 1 }}
                lg={{ size: 6, order: 1 }}
                className="text-center text-md-left mt-3 mt-md-0 mb-1 mb-md-0"
              ></Col>
            </Row>
            <Switch>
              <Route exact path="/shop" component={ProductsShop} />
              <Route path="/shop/category/:slug" component={CategoryShop} />
              <Route path="/shop/brand/:slug" component={BrandsShop} />
              <Route path="*" component={Page404} />
            </Switch>

            {totalProducts >= 8 && (
              <div className="d-flex justify-content-center text-center mt-4">
                <Pagination
                  handlePagenationChangeSubmit={filterProducts}
                  products={products}
                  pages={pages}
                  page={pageNumber}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    advancedFilters: state.product.advancedFilters
  };
};

export default connect(mapStateToProps, actions)(Shop);

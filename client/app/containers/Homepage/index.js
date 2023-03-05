/**
 *
 * Homepage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/helpers';
import ShopByCategory from '../FlashSaleSection/ShopByCategory';
import FlashSaleMaxSlider from '../FlashSaleSection/FlashSaleMaxSlider';
import HomeBannerSlider from "../FlashSaleSection/HomeBannerSlider";

class Homepage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStoreCategories();
    this.props.fetchShop();
  }

  render() {
    const { categories, marketing, shop } = this.props;
    let imageBannerSecondary = shop?.imageBannerSecondary?.split("\n");
    return (
      <div className="homepage">
        <Row className="flex-row mb-3">
          <HomeBannerSlider shop={shop} />
          <br />
          <ShopByCategory categories={categories} />
        </Row>

        <Row className="flex-row">
          {imageBannerSecondary?.map((item) => (
            <Col xs="12" lg="6" className="order-lg-1 mb-3 px-3 px-md-2">
              <div className="d-flex flex-column h-100 justify-content-between">
                <img src={item} />
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          <FlashSaleMaxSlider marketing={marketing} />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.homepage.categories,
    shop: state.homepage.shop,
    marketing: state.navigation.marketing,
  };
};

export default connect(mapStateToProps, actions)(Homepage);

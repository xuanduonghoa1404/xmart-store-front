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
    console.log("componentDidMount Homepage");
    this.props.fetchStoreCategories();
    this.props.fetchShop();
  }

  render() {
    const { categories, marketing, shop } = this.props;
    return (
      <div className="homepage">
        <Row className="flex-row mb-3">
          <HomeBannerSlider shop={shop} />
          <br />
          <ShopByCategory categories={categories} />
        </Row>

        <Row className="flex-row">
          {/* <Col xs="12" lg="6" className="order-lg-2 mb-3 px-3 px-md-2">
            <div className="home-carousel">
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} />
                ))}
              </CarouselSlider>
            </div>
          </Col> */}
          <Col xs="12" lg="6" className="order-lg-1 mb-3 px-3 px-md-2">
            <div className="d-flex flex-column h-100 justify-content-between">
              {/* <img src="/images/banners/banner-2.jpg" className="mb-3" /> */}
              <img src="https://res.cloudinary.com/hoaduonghx/image/upload/v1669905041/image/banner4_dtzphj.png" />
            </div>
          </Col>
          <Col xs="12" lg="6" className="order-lg-3 mb-3 px-3 px-md-2">
            <div className="d-flex flex-column h-100 justify-content-between">
              {/* <img src="/images/banners/banner-2.jpg" className="mb-3" /> */}
              <img src="https://res.cloudinary.com/hoaduonghx/image/upload/v1669905052/image/banner5_wswdsl.png" />
            </div>
          </Col>
        </Row>
        {/* <Row className='flex-row'>
          <Col xs='12' lg='12' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
            {categories && categories.length &&
             <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={categories}
                responsive={responsiveOneItemCarousel}
              >
                {categories?.map((item, index) => (
                  <img key={index} src={item.photo} />
                ))}
              </CarouselSlider>}
            </div>
          </Col>
        </Row> */}
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

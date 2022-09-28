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

class Homepage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStoreCategories();
  }

  render() {
    const {
      categories,
      storeCategories
    } = this.props;
    console.log('categories', categories)
    console.log('storeCategories', storeCategories)
    return (
      <div className='homepage'>
        <Row className='flex-row'>
          <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
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
          </Col>
          <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='https://res.cloudinary.com/hoaduonghx/image/upload/v1663519612/image/zxsmq7ntqnvqwborlwng.png' />
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='https://res.cloudinary.com/hoaduonghx/image/upload/v1663518722/image/fm4do7mcupb2yajdiedc.png' />
            </div>
          </Col>
        </Row>
        <Row className='flex-row'>
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
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);

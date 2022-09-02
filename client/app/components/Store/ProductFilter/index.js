/**
 *
 * ProductFilter
 *
 */

import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import RangeSlider from '../../Common/RangeSlider';

const priceMarks = {
  1: { label: <p className='fw-1 text-black'>1</p> },
  1000: { label: <p className='fw-1 text-black'>1000</p> }
};

const ProductFilter = props => {
  const { filterProducts } = props;

  return (
    <div className='product-filter'>
      <Card className='mb-4'>
        <CardHeader tag='h3'>Khoảng Giá (nghìn đồng)</CardHeader>
        <CardBody>
          <div className='mx-2 mb-3'>
            <RangeSlider
              marks={priceMarks}
              defaultValue={[1, 1000]}
              onChange={v => {
                filterProducts('price', v);
              }}
            />
          </div>
        </CardBody>
      </Card>
      {/* <Card>
        <CardHeader tag='h3'>Rating</CardHeader>
        <CardBody>
          <div className='mx-2 mb-4'>
            <RangeSlider
              type='slider'
              marks={rateMarks}
              step={20}
              defaultValue={100}
              onChange={v => {
                filterProducts('rating', rating(v));
              }}
            />
          </div>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default ProductFilter;

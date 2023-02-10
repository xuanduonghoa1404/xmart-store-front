import React, { Children } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";

import "./SwiperContainer.css";

SwiperCore.use([Autoplay, Navigation, Pagination]);

const SwiperContainer = (props) => {
  const {
    children,
    space,
    center,
    pagination,
    autoplay,
    navigation,
    responsive,
    loop,
  } = props;

  const childRender = Children.map(children, (ele) => (
    <SwiperSlide>{ele}</SwiperSlide>
  ));

  return (
    <Swiper
      spaceBetween={space}
      centeredSlides={center}
      loop={loop}
      pagination={pagination}
      navigation={navigation}
      autoplay={autoplay}
      modules={[Autoplay, Pagination, Navigation]}
      breakpoints={responsive}
    >
      {childRender}
    </Swiper>
  );
};

export default SwiperContainer;

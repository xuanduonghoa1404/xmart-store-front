import React from "react";

import SwiperContainer from "../../components/Common/SwiperContainer/SwiperContainer";

const FlashSaleMaxSlider = (props) => {
  const imgsArr = props.marketing;

  const imgRender = () =>
    imgsArr?.map((marketing) => (
      <a href="/">
        <img
          className="hoverEffect"
          key={marketing._id}
          width="100%"
          src={marketing.photo}
          alt={marketing.name}
        />
      </a>
    ));

  const responsive = {
    567: {
      slidesPerView: 2,
    },
    900: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    },
    1400: {
      slidesPerView: 3,
    },
  };

  return (
    <SwiperContainer
      space={16}
      pagination={false}
      navigation={true}
      center={false}
      responsive={responsive}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop={true}
    >
      {imgRender()}
    </SwiperContainer>
  );
};

export default FlashSaleMaxSlider;

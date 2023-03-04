import React from "react";

import SwiperContainer from "../../components/Common/SwiperContainer/SwiperContainer";

const HomeBannerSlider = (props) => {
  console.log("props", props);
  const shop = props?.shop;
  const imageBanner = shop?.imageBanner ? shop.imageBanner.split("\n") : [];
  console.log("imageBanner", imageBanner, imageBanner && imageBanner.length);
  const imgsArr =
    imageBanner && imageBanner.length
      ? imageBanner
      : [
          "https://res.cloudinary.com/hoaduonghx/image/upload/v1670163364/image/Banner6_pi5vpd.png",
          "https://res.cloudinary.com/hoaduonghx/image/upload/v1670420289/image/banner9_wvgkqt.png",
          "https://res.cloudinary.com/hoaduonghx/image/upload/v1670163364/image/Banner6_pi5vpd.png",
          "https://res.cloudinary.com/hoaduonghx/image/upload/v1670420289/image/banner9_wvgkqt.png",
        ];

  const imgRender = () =>
    imgsArr.map((img, idx) => (
      <img
        className="hoverEffect"
        key={idx}
        width="100%"
        src={img}
        alt={`img${idx}`}
      />
    ));

  const responsive = {
    567: {
      slidesPerView: 1,
    },
    900: {
      slidesPerView: 1,
    },
    1200: {
      slidesPerView: 1,
    },
    1400: {
      slidesPerView: 1,
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

export default HomeBannerSlider;

import React from "react";

import img1 from "./Imgs/lg-img-1.jpg";
import img2 from "./Imgs/lg-img-2.jpg";
import img3 from "./Imgs/lg-img-3.jpg";
import SwiperContainer from "../../components/Common/SwiperContainer/SwiperContainer";

const FlashSaleMaxSlider = () => {
  const imgsArr = [
    "https://res.cloudinary.com/hoaduonghx/image/upload/v1670163421/image/banner2_1_l9zpcl.png",
    "https://res.cloudinary.com/hoaduonghx/image/upload/v1669905017/image/banner3_khvtdi.png",
    "https://res.cloudinary.com/hoaduonghx/image/upload/v1670163414/image/banner1_1_jf4iuz.png",
  ];

  const imgRender = () =>
    imgsArr.map((img, idx) => (
      <a href="/">
        <img
          className="hoverEffect"
          key={idx}
          width="100%"
          src={img}
          alt={`img${idx}`}
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
        delay: 2700,
        disableOnInteraction: false,
      }}
      loop={true}
    >
      {imgRender()}
    </SwiperContainer>
  );
};

export default FlashSaleMaxSlider;

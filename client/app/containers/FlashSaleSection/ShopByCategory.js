import React from "react";
import { Link } from "react-router-dom";

import SwiperContainer from "../../components/Common/SwiperContainer/SwiperContainer";

const ShopByCategory = (props) => {
  const { categories } = props;

  const categoryRender = () =>
    categories.map(({ slug, name, photo }, idx) => (
      <Link to={`/shop/category/${slug}`} className="section" key={idx}>
        <div className="img overflow-hidden position-relative rounded-circle ">
          <img className="w-100" src={photo} alt={name} />
        </div>
        <p className="title text-center fw-bold mt-3 mb-auto">{name}</p>
      </Link>
    ));

  const responsive = {
    300: {
      slidesPerView: categories?.length - 6 || 2,
    },
    568: {
      slidesPerView: categories?.length - 5 || 3,
    },
    768: {
      slidesPerView: categories?.length - 4 || 4,
    },
    900: {
      slidesPerView: categories?.length - 2 || 6,
    },
    1400: {
      slidesPerView: categories?.length || 8,
    },
  };

  return (
    <SwiperContainer
      space={30}
      pagination={false}
      navigation={true}
      center={false}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      responsive={responsive}
      loop={true}
    >
      {categoryRender()}
    </SwiperContainer>
  );
};

export default ShopByCategory;

import React, { useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
// import { imagesSlide } from '../../../fake-data/product';
import ArrowLeft from '../../../components/Svg/ArrowLeftIcon';
import { useWindowDimensions } from '../../../hooks';
import { setOnErrorImage } from '../../../utils/helpers';

function SliderProductImage(props) {
  const sliderRef = useRef();
  const { product } = props;
  const [currentImg, setCurrentImg] = useState(1);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentImg(newIndex + 1),
  };
  const { width } = useWindowDimensions();
  const isLaptop = width >= 1024;

  const productFiles = useMemo(() => {
    const fileList = [];
    if (product?.productThumbnail) {
      fileList.push(product?.productThumbnail);
    }
    if (
      Array.isArray(product?.productFiles) &&
      product?.productFiles.length > 0
    ) {
      for (let i = 0; i < product?.productFiles.length; i += 1) {
        fileList.push(product?.productFiles[i]);
      }
    }

    return fileList.length <= 0 ? ['/assets/products/no-image.png'] : fileList;
  }, [product]);
  const handleClickPrevImage = () => {
    sliderRef.current.slickPrev();
  };
  const handleClickNextImage = () => {
    sliderRef.current.slickNext();
  };
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Slider {...settings} className="img-slider" ref={sliderRef}>
        {productFiles.map((item, index) => {
          const keyImg = `thumnail-${product.name}-${product.id}-${index}`;
          return (
            <div key={keyImg} className="relative">
              <img
                className="img-slider"
                style={{
                  minWidth: '100%',
                  minHeight: '100%',
                  width: '100%',
                  // objectFit: 'cover',
                }}
                src={item}
                alt={item}
                id={keyImg}
                onError={() => setOnErrorImage(keyImg)}
              />
            </div>
          );
        })}
      </Slider>
      <div className="control-button flex w-[130px] h-9 bg-black/[0.4] rounded-[100px] items-center justify-center absolute bottom-5 gap-[10px] left-2/4 translate-x-[-50%]">
        <ArrowLeft
          onClick={handleClickPrevImage}
          stroke={`${isLaptop ? '#fff' : '#1c1c1c'}`}
        />
        <div className="text-white f16Medium lg:f20Medium font-roboto">
          <span className="mr-[3px]">{`0${currentImg}`}</span>
          <span className="text-secondaryLine">
            / {`0${productFiles.length}`}
          </span>
        </div>
        <ArrowLeft
          onClick={handleClickNextImage}
          stroke={`${isLaptop ? '#fff' : '#1c1c1c'}`}
          className="rotate-180"
        />
      </div>
      <ul className="hidden lg:flex flex-nowrap gap-[10px] mt-[10px] overflow-x-auto overflow-y-hidden absolute">
        {productFiles.map((item, index) => {
          const keyImg = `${product.name}-${product.id}-${index}`;
          return (
            <li
              // className="h-[127px]"
              key={keyImg}
              style={{ width: `calc(25% - ${30 / 4}px)` }}
            >
              <img
                id={keyImg}
                src={item}
                alt={item}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: 'none',
                  aspectRatio: '1',
                }}
                onError={() => setOnErrorImage(keyImg)}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

SliderProductImage.propTypes = {};

export default SliderProductImage;

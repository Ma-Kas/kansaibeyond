import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import { PrevButton, NextButton } from './EmblaCarouselArrowButtons';
import usePrevNextButtons from './usePrevNextButtons';
import useEmblaCarousel from 'embla-carousel-react';
import { CarouselImage, CarouselType } from '../../nodes/CarouselContainerNode';
import { LazyImage } from '../../nodes/CarouselComponent';

type PropType = {
  carouselType: CarouselType;
  imagesInView: number | null | undefined;
  imageGap?: string | null | undefined;
  slides: CarouselImage[];
  options?: EmblaOptionsType;
};

type InlineStyleType = {
  container: {
    marginLeft?: string | undefined;
  };
  slide: {
    paddingLeft?: string | undefined;
    flex?: string | undefined;
  };
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { carouselType, imagesInView, imageGap, slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // If user has overriden stylesheet with inline properties, set them here
  // to apply to component
  const setInlineStyleOverride = (): InlineStyleType => {
    const style: InlineStyleType = { container: {}, slide: {} };
    if (carouselType !== 'slider') {
      return style;
    }
    if (imageGap) {
      style.container.marginLeft = `-${imageGap}`;
      style.slide.paddingLeft = `${imageGap}`;
    }
    if (imagesInView) {
      style.slide.flex =
        imageGap !== '0'
          ? `0 0 calc(${100 / imagesInView}% - ${imageGap})`
          : `0 0 calc(${100 / imagesInView}%`;
    }
    return style;
  };

  const inlineStyle = setInlineStyleOverride();

  return (
    <>
      <div className='editor_embla_viewport' ref={emblaRef}>
        <div className='editor_embla_container' style={inlineStyle.container}>
          {slides.map((image) => {
            return (
              <div
                className='editor_embla_slide'
                style={inlineStyle.slide}
                key={image.id}
              >
                <LazyImage
                  className='carousel-image'
                  src={image.src}
                  altText={image.altText}
                  objectPosition={image.objectPosition}
                  aspectRatio={image.aspectRatio}
                  imagesInView={imagesInView}
                  imageGap={imageGap}
                />
              </div>
            );
          })}
        </div>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </>
  );
};

export default EmblaCarousel;

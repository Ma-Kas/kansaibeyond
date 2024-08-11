'use client';

import type * as CSS from 'csstype';
import useEmblaCarousel from 'embla-carousel-react';
import {
  PrevButton,
  NextButton,
} from '@/components/EmblaCarousel/EmblaCarouselArrowButtons';
import usePrevNextButtons from '@/components/EmblaCarousel/usePrevNextButtons';
import {
  CarouselImage,
  ImageCarouselContainerNode,
} from '@/types/post-content-types';
import { POST_CAROUSEL_IMAGE_TRANSFORM } from '@/config/constants';
import BlurryLoadingGalleryImage from '../BlurryLoadingImage/BlurryLoadingGalleryImage';

import classes from './PostCarouselContainer.module.css';

type Props = {
  containerNode: ImageCarouselContainerNode;
};

const PostCarouselContainer = ({ containerNode }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const imageList = containerNode.imageList;

  const containerStyle: CSS.Properties = {};
  if (containerNode.width && containerNode.width !== undefined) {
    containerStyle.width = containerNode.width;
  }
  if (containerNode.maxWidth && containerNode.maxWidth !== undefined) {
    containerStyle.maxWidth = containerNode.maxWidth;
  }

  // If user has overridden stylesheet with inline properties, set them here
  // to apply to component
  const setInlineStyleOverride = (): {
    innerContainer: CSS.Properties;
    slide: CSS.Properties;
  } => {
    const innerContainerStyle: CSS.Properties = {};
    const slideStyle: CSS.Properties = {};
    if (containerNode.carouselType !== 'slider') {
      return { innerContainer: innerContainerStyle, slide: slideStyle };
    }
    if (containerNode.imageGap) {
      innerContainerStyle.marginLeft = `-${containerNode.imageGap}`;
      slideStyle.paddingLeft = `${containerNode.imageGap}`;
    }
    if (containerNode.imagesInView) {
      slideStyle.flex =
        containerNode.imageGap &&
        containerNode.imageGap !== undefined &&
        containerNode.imageGap !== '0'
          ? `0 0 calc(${100 / containerNode.imagesInView}% - ${
              containerNode.imageGap
            })`
          : `0 0 calc(${100 / containerNode.imagesInView}%`;
    }
    return { innerContainer: innerContainerStyle, slide: slideStyle };
  };

  const setImageInlineStyleOverride = (
    image: CarouselImage
  ): CSS.Properties => {
    const imageStyle: CSS.Properties = {};

    if (image.aspectRatio) {
      imageStyle.aspectRatio = `${image.aspectRatio}`;
    }

    return imageStyle;
  };

  const inlineStyles = setInlineStyleOverride();

  return (
    <figure
      className={classes['post_carousel_container']}
      {...(containerStyle && { style: containerStyle })}
    >
      <div className={classes['post_carousel_viewport']} ref={emblaRef}>
        <div
          className={classes['post_carousel_inner_container']}
          style={inlineStyles.innerContainer}
        >
          {imageList.map((image, index) => {
            return (
              <div
                className={classes['post_carousel_slide']}
                style={inlineStyles.slide}
                key={image.id}
              >
                <BlurryLoadingGalleryImage
                  key={index}
                  className={classes['post_carousel_image']}
                  image={image}
                  transform={POST_CAROUSEL_IMAGE_TRANSFORM}
                  style={setImageInlineStyleOverride(image)}
                />
              </div>
            );
          })}
        </div>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
      {containerNode.captionText && (
        <figcaption className={classes['post_carousel_caption']}>
          {containerNode.captionText}
        </figcaption>
      )}
    </figure>
  );
};

export default PostCarouselContainer;

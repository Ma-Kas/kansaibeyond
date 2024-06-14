import type * as CSS from 'csstype';
import { ImageGalleryContainerNode } from '@/types/post-content-types';
import {
  CLOUDINARY_BASE_URL,
  POST_GALLERY_IMAGE_TRANSFORM,
} from '@/config/constants';

import classes from './PostGalleryContainer.module.css';

type Props = {
  containerNode: ImageGalleryContainerNode;
};

const PostGalleryContainer = ({ containerNode }: Props) => {
  const imageList = containerNode.imageList;

  const containerStyle: CSS.Properties = {};
  if (containerNode.width && containerNode.width !== undefined) {
    containerStyle.width = containerNode.width;
  }
  if (containerNode.maxWidth && containerNode.maxWidth !== undefined) {
    containerStyle.maxWidth = containerNode.maxWidth;
  }

  const switchRenderOnGalleryType = () => {
    const galleryFiguresStyle: CSS.Properties = {};
    if (containerNode.gridGap && containerNode.gridGap !== undefined) {
      galleryFiguresStyle.gap = containerNode.gridGap;
    }
    switch (containerNode.gridType) {
      case 'static-type': {
        if (containerNode.columns && containerNode.columns !== undefined) {
          galleryFiguresStyle.gridTemplateColumns = `repeat(${containerNode.columns}, 1fr)`;
        }
        return (
          <div
            className={classes['post_gallery_figures_static']}
            {...(galleryFiguresStyle && { style: galleryFiguresStyle })}
          >
            {imageList.map((image, index) => {
              return (
                <img
                  key={index}
                  className={classes['post_gallery_image_static']}
                  src={`${CLOUDINARY_BASE_URL}${POST_GALLERY_IMAGE_TRANSFORM}${image.src}`}
                  alt={image.altText}
                />
              );
            })}
          </div>
        );
      }
      case 'flex-type': {
        return (
          <div
            className={classes['post_gallery_figures_flex']}
            {...(galleryFiguresStyle && { style: galleryFiguresStyle })}
          >
            {imageList.map((image, index) => {
              return (
                <img
                  key={index}
                  className={classes['post_gallery_image_flex']}
                  src={`${CLOUDINARY_BASE_URL}${POST_GALLERY_IMAGE_TRANSFORM}${image.src}`}
                  alt={image.altText}
                />
              );
            })}
          </div>
        );
      }
      default: {
        // Equivalent to dynamic-type
        if (
          containerNode.columnMinWidth &&
          containerNode.columnMinWidth !== undefined
        ) {
          galleryFiguresStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${containerNode.columnMinWidth}px, 1fr))`;
        }
        return (
          <div
            className={classes['post_gallery_figures_dynamic']}
            {...(galleryFiguresStyle && { style: galleryFiguresStyle })}
          >
            {imageList.map((image, index) => {
              const galleryImageStyle: CSS.Properties = {};
              if (image.objectPosition && image.objectPosition !== undefined) {
                galleryImageStyle.objectPosition = image.objectPosition;
              }
              if (image.imageWidth && image.imageWidth !== undefined) {
                galleryImageStyle.width = image.imageWidth;
              }
              if (image.aspectRatio && image.aspectRatio !== undefined) {
                galleryImageStyle.aspectRatio = image.aspectRatio;
              }
              return (
                <img
                  key={index}
                  className={classes['post_gallery_image_dynamic']}
                  {...(galleryImageStyle && { style: galleryImageStyle })}
                  src={`${CLOUDINARY_BASE_URL}${POST_GALLERY_IMAGE_TRANSFORM}${image.src}`}
                  alt={image.altText}
                />
              );
            })}
          </div>
        );
      }
    }
  };

  return (
    <div
      className={classes['post_gallery_container']}
      {...(containerStyle && { style: containerStyle })}
    >
      {switchRenderOnGalleryType()}
      {containerNode.captionText && (
        <div className={classes['post_gallery_caption']}>
          {containerNode.captionText}
        </div>
      )}
    </div>
  );
};

export default PostGalleryContainer;

/* eslint-disable @next/next/no-img-element */
'use client';

import type * as CSS from 'csstype';
import { useEffect, useState } from 'react';
import { GalleryImage } from '@/types/post-content-types';
import {
  CLOUDINARY_BASE_URL,
  WSRV_BASE_URL,
  WSRV_TRANSFORM,
  LOADING_PLACEHOLDER_IMAGE_TRANSFORM,
} from '@/config/constants';

type Props = {
  className: string;
  image: GalleryImage;
  transform: string;
  style?: CSS.Properties;
};

const BlurryLoadingGalleryImage = ({
  className,
  image,
  transform,
  style,
}: Props) => {
  const [currentImage, setCurrentImage] = useState(
    `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${LOADING_PLACEHOLDER_IMAGE_TRANSFORM}${image.src}${WSRV_TRANSFORM}`
  );
  const [loading, setLoading] = useState(true);

  const fetchImage = (src: string) => {
    const loadingImage = new Image();
    loadingImage.src = src;
    loadingImage.onload = () => {
      setCurrentImage(loadingImage.src);
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchImage(
      `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${transform}${image.src}${WSRV_TRANSFORM}`
    );
  }, [image, transform]);

  return (
    <img
      style={{
        filter: `${loading ? 'blur(20px)' : ''}`,
        transition: '0.5s filter linear',
        ...style,
      }}
      className={className}
      src={currentImage}
      alt={image.altText}
    />
  );
};

export default BlurryLoadingGalleryImage;

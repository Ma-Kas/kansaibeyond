/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { ImageNode } from '@/types/post-content-types';
import {
  CLOUDINARY_BASE_URL,
  WSRV_BASE_URL,
  WSRV_TRANSFORM,
  LOADING_PLACEHOLDER_IMAGE_TRANSFORM,
  POST_SINGLE_IMAGE_TRANSFORM,
} from '@/config/constants';

type Props = {
  className: string;
  node: ImageNode;
};

const BlurryLoadingImage = ({ className, node }: Props) => {
  // Optimise image loading further, pass this into fetchImageTransform
  // Will optimise size, but quality suffers visibly. Leaving here in case
  // const imageWidth = node.maxWidth ? Number(node.maxWidth.slice(0, -2)) : 740;

  const [currentImage, setCurrentImage] = useState(
    `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${LOADING_PLACEHOLDER_IMAGE_TRANSFORM}${node.src}${WSRV_TRANSFORM}`
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
      `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${POST_SINGLE_IMAGE_TRANSFORM}${node.src}${WSRV_TRANSFORM}`
    );
  }, [node.src]);

  return (
    <img
      style={{
        filter: `${loading ? 'blur(20px)' : ''}`,
        transition: '0.5s filter linear',
      }}
      className={className}
      src={currentImage}
      alt={node.altText}
      loading='lazy'
      decoding='async'
    />
  );
};

export default BlurryLoadingImage;

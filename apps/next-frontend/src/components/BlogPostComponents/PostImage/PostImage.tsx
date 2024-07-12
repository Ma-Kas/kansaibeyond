/* eslint-disable @next/next/no-img-element */

import parseInlineStyle from '@/utils/parse-inline-style-string';
import {
  CLOUDINARY_BASE_URL,
  POST_SINGLE_IMAGE_TRANSFORM,
} from '@/config/constants';

import classes from './PostImage.module.css';

type Props = {
  style?: string;
  src: string;
  alt: string;
};

const PostImage = ({ style, src, alt }: Props) => {
  return (
    <img
      className={classes['post_image']}
      src={`${CLOUDINARY_BASE_URL}${POST_SINGLE_IMAGE_TRANSFORM}${src}`}
      alt={alt}
      {...(style && { style: parseInlineStyle(style) })}
    />
  );
};

export default PostImage;

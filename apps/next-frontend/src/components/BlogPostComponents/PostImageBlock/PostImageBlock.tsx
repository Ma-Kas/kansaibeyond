import type * as CSS from 'csstype';
import { ImageAlignmentType, ImageBlockNode } from '@/types/post-content-types';
import parseInlineStyle from '@/utils/parse-inline-style-string';

import classes from './PostImageBlock.module.css';

type Props = {
  style?: string;
  imageBlockNode: ImageBlockNode;
  alignment: ImageAlignmentType;
  children?: React.ReactNode;
};

const PostImageBlock = ({
  style,
  imageBlockNode,
  alignment,
  children,
}: Props) => {
  const image = imageBlockNode.children[0];

  const blockStyle: CSS.Properties = {};

  if (alignment && alignment !== undefined) {
    blockStyle.justifyContent = alignment;
  }

  const containerStyle: CSS.Properties = {};
  if (image && image.width && image.width !== undefined) {
    containerStyle.width = image.width;
  }
  if (image && image.maxWidth && image.maxWidth !== undefined) {
    containerStyle.maxWidth = image.maxWidth;
  }

  return (
    <div
      className={classes['post_image_block']}
      {...(blockStyle && { style: blockStyle })}
    >
      <div
        className={classes['post_image_container']}
        {...(containerStyle && { style: containerStyle })}
      >
        <figure
          className={classes['post_image_figure']}
          {...(style && { style: parseInlineStyle(style) })}
        >
          {children}
          {image.captionText && (
            <figcaption className={classes['post_image_caption']}>
              {image.captionText}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
};

export default PostImageBlock;

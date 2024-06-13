import type * as CSS from 'csstype';
import { ImageAlignmentType } from '../../../types/post-content-types';

import classes from './PostEmbedBlock.module.css';

type Props = {
  alignment: ImageAlignmentType;
  children?: React.ReactNode;
};

const PostEmbedBlock = ({ alignment, children }: Props) => {
  const blockStyle: CSS.Properties = {};
  if (alignment && alignment !== undefined) {
    blockStyle.justifyContent = alignment;
  }

  return (
    <div
      className={classes['post_embed_block']}
      {...(blockStyle && { style: blockStyle })}
    >
      {children}
    </div>
  );
};

export default PostEmbedBlock;

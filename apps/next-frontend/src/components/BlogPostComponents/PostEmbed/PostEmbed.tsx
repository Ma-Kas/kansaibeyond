import type * as CSS from 'csstype';
import { Tweet } from 'react-tweet';
import { EmbedNode } from '@/types/post-content-types';

import classes from './PostEmbed.module.css';

type Props = {
  embedNode: EmbedNode;
};

const PostEmbed = ({ embedNode }: Props) => {
  const containerStyle: CSS.Properties = {};
  if (embedNode.width && embedNode.width !== undefined) {
    containerStyle.width = embedNode.width;
  }
  if (embedNode.maxWidth && embedNode.maxWidth !== undefined) {
    containerStyle.maxWidth = embedNode.maxWidth;
  }
  if (embedNode.aspectRatio && embedNode.aspectRatio !== undefined) {
    containerStyle.aspectRatio = embedNode.aspectRatio;
  }

  if (embedNode.embedType === 'twitter') {
    return (
      <div
        className={classes['post_embed_container']}
        {...(containerStyle && { style: containerStyle })}
      >
        <div className={classes['post_embed']}>
          <Tweet id={embedNode.source} />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={classes['post_embed_container']}
        {...(containerStyle && { style: containerStyle })}
      >
        <div
          className={classes['post_embed']}
          dangerouslySetInnerHTML={{ __html: embedNode.source }}
        ></div>
      </div>
    );
  }
};

export default PostEmbed;

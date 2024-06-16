import type * as CSS from 'csstype';
import { Tweet } from 'react-tweet';

import { EmbedNode } from '@/types/post-content-types';

import classes from './PostEmbed.module.css';
import PostInstagramEmbed from './PostInstagramEmbed';

type Props = {
  embedNode: EmbedNode;
};

// Instagram embed is messed up with hydration again, try following:
// react-social-media-embed package
// use-client and useEffect to embed to script from there
// no idea

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
        data-theme='light'
      >
        <div className={classes['post_embed']}>
          <Tweet id={embedNode.source} />
        </div>
      </div>
    );
  } else if (embedNode.embedType === 'instagram') {
    return (
      <div
        className={classes['post_embed_container']}
        {...(containerStyle && { style: containerStyle })}
      >
        <PostInstagramEmbed embedNode={embedNode} />
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

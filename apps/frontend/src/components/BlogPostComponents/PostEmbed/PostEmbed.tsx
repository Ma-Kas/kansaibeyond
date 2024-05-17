import type * as CSS from 'csstype';
import { useEffect } from 'react';
import { Tweet } from 'react-tweet';
import { EmbedNode } from '../../../types/post-content-types';
import { INSTAGRAM_SCRIPT_URL } from '../../../config/constants';

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

  // Insert and load instagram script when a post contains instagram embed
  useEffect(() => {
    if (embedNode.embedType !== 'instagram') {
      return;
    }
    // // If script alreay exists, don't create another one
    const existingScript = document.querySelectorAll('[data-type="instagram"]');
    if (!existingScript.length) {
      const script = document.createElement('script');
      script.src = INSTAGRAM_SCRIPT_URL;
      script.dataset.type = 'instagram';
      script.async = true;
      document.body?.appendChild(script);
    }

    // Force reload the widget to style embedded html code
    // @ts-expect-error Instagram is attached to the window.
    if (window.instgrm) {
      // @ts-expect-error Instagram is attached to the window.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      window.instgrm.Embeds.process();
    }
  }, [embedNode.embedType]);

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

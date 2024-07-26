'use client';

import { INSTAGRAM_SCRIPT_URL } from '@/config/constants';
import { EmbedNode } from '@/types/post-content-types';
import { useEffect } from 'react';

import classes from './PostEmbed.module.css';

const PostInstagramEmbed = ({ embedNode }: { embedNode: EmbedNode }) => {
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

  return (
    <div
      className={classes['post_embed']}
      dangerouslySetInnerHTML={{ __html: embedNode.source }}
    ></div>
  );
};

export default PostInstagramEmbed;

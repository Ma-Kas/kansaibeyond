import constructComponentTree from './utils/post-content-constructor';
import { mockdataSimple } from '../../mockdata/mockdata';

import classes from './BlogPostView.module.css';

const BlogPostView = () => {
  constructComponentTree(mockdataSimple);
  return (
    <main className={classes['blog_post_main']}>
      <h1>
        Love Pokemon? Love Photographing Unique Manholes? A Must-Do in Tokyo!
        (Part 1)
      </h1>
      <section>
        <p>
          Hi friends, it's been awhile! I hope the weather's been treating you
          well. Now that I'm back in my hometown and properly away from Japan
          life in real time, I've been just slowly reflecting on life, enjoying
          and reconnecting with my family and friends. Least to say, a lot has
          happened since I have left Japan and all has been...... interesting.
        </p>
        <p>
          Anyway, I saw a post earlier this week on a Japan travel forum.
          Someone posted a few photos of Pokemon manholes they've found, stating
          they were properly surprised to find them.
        </p>
      </section>
    </main>
  );
};

export default BlogPostView;

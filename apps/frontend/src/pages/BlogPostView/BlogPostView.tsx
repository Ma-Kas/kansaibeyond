import constructComponentTree from './utils/postContentConstructor';
import { mockdataComplex } from '../../mockdata/mockdata';

import classes from './BlogPostView.module.css';

const BlogPostView = () => {
  return (
    <main className={classes['blog_post_main']}>
      <h1>
        Love Pokemon? Love Photographing Unique Manholes? A Must-Do in Tokyo!
        (Part 1)
      </h1>
      {constructComponentTree(mockdataComplex)}
    </main>
  );
};

export default BlogPostView;

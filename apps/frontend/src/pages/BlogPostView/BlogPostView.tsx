import constructComponentTree from './utils/postContentConstructor';
import { mockdataComplex } from '../../mockdata/mockdata';

import classes from './BlogPostView.module.css';

const BlogPostView = () => {
  return (
    <main className={classes['blog_post_main']}>
      <h1>
        Unwind and Relax: Essential Tips for Going to a Hot Springs in Japan
      </h1>
      {constructComponentTree(mockdataComplex)}
    </main>
  );
};

export default BlogPostView;

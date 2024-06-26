import constructComponentTree from '@/utils/postContentConstructor';
import { Post } from '@/lib/requests/postRequests';

import classes from './BlogPostView.module.css';

const BlogPostView = ({ postData }: { postData: Post }) => {
  return (
    <main className={classes['blog_post_main']}>
      <h1 className={classes['blog_post_title']}>{postData.title}</h1>
      {constructComponentTree(JSON.parse(postData.content))}
    </main>
  );
};

export default BlogPostView;

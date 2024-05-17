import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import constructComponentTree from './utils/postContentConstructor';
import { getOnePost } from '../../requests/postRequests';

import classes from './BlogPostView.module.css';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';

const BlogPostView = () => {
  const { postSlug } = useParams();

  const currentUrlSlug = postSlug!;

  const postQuery = useQuery({
    queryKey: [postSlug],
    queryFn: () => getOnePost(currentUrlSlug),
    retry: 1,
  });

  if (postQuery.isPending || postQuery.isRefetching) {
    return (
      <main className={classes['blog_post_main']}>
        <div className={classes['blog_post_loading_error_container']}>
          ...now loading
        </div>
      </main>
    );
  }

  if (postQuery.error) {
    return (
      <main className={classes['blog_post_main']}>
        <div className={classes['blog_post_loading_error_container']}>
          <DynamicErrorPage error={postQuery.error} />
        </div>
      </main>
    );
  }

  if (postQuery.data && postQuery.data.content) {
    return (
      <main className={classes['blog_post_main']}>
        <h1>{postQuery.data.title}</h1>
        {constructComponentTree(JSON.parse(postQuery.data.content))}
      </main>
    );
  }

  return <></>;
};

export default BlogPostView;

// import dynamic from 'next/dynamic';

import { getOnePost } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';

// const NoSSR = dynamic(() => import('@/components/BlogPostView/BlogPostView'), {
//   ssr: false,
// });

const PostPage = async ({
  params: { postSlug },
}: {
  params: { postSlug: string };
}) => {
  const post = await getOnePost(postSlug);

  if (post) {
    return (
      <div style={{ padding: '40px 0' }}>
        <BlogPostView postData={post} />
      </div>
    );
  } else {
    return <div>No post</div>;
  }
};

export default PostPage;

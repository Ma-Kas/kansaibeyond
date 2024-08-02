import dynamic from 'next/dynamic';
import { getOnePost } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';

const DynamicScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
});

// export const generateStaticParams = async () => {
//   const posts = await getAllPosts();
//   return posts.rows.map((post) => ({
//     postSlug: post.postSlug,
//   }));
// };

const PostPage = async ({
  params: { postSlug },
}: {
  params: { postSlug: string };
}) => {
  const post = await getOnePost(postSlug);

  return (
    <>
      <DynamicScrollToTop />
      <BlogPostView postData={post} />
    </>
  );
};

export default PostPage;

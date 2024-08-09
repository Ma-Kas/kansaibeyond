import dynamic from 'next/dynamic';
import { getOnePost } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';

const DynamicScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
});

// export const generateStaticParams = async () => {
//   const postSlugs = await getPostSlugList();
//   return postSlugs;

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

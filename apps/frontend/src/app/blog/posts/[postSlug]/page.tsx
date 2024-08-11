import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { getOnePost, getPostSlugList } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';

const DynamicScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
});

export const generateStaticParams = async () => {
  const postSlugs = await getPostSlugList();
  return postSlugs;
};

export const generateMetadata = async ({
  params,
}: {
  params: { postSlug: string };
}): Promise<Metadata> => {
  const post = await getOnePost(params.postSlug);

  return {
    title: post.title,
    description: 'Read through this exciting post.',
  };
};

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

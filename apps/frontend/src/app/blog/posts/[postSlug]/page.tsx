import type { Metadata } from 'next';
import { getOnePost, getPostSlugList } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';

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
      <BlogPostView postData={post} />
    </>
  );
};

export default PostPage;

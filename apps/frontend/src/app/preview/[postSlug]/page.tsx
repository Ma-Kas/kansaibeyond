import { getOnePreviewPost } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';

const PostPreviewPage = async ({
  params: { postSlug },
}: {
  params: { postSlug: string };
}) => {
  const post = await getOnePreviewPost(postSlug);

  // Purposely omitting loading indicators from this route
  // To not give indication to not logged in users that this route even exists
  return <BlogPostView postData={post} />;
};

export default PostPreviewPage;

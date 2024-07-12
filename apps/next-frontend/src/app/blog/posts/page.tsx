import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import { getAllPosts } from '@/lib/requests/postRequests';

const PostsPage = async () => {
  const posts = await getAllPosts();

  return (
    <>
      <PostGridSection posts={posts} withViewMoreLink={false}>
        <SectionHeading>
          <span>All</span>&nbsp;posts
        </SectionHeading>
      </PostGridSection>
    </>
  );
};

export default PostsPage;

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';

const PostsPage = () => {
  return (
    <>
      <PostGridSection queryParams='' withViewMoreLink={false}>
        <SectionHeading>
          <span>All</span>&nbsp;posts
        </SectionHeading>
      </PostGridSection>
    </>
  );
};

export default PostsPage;

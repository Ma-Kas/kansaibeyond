import { Suspense } from 'react';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';

const PostsPage = () => {
  const sectionHeading = (
    <SectionHeading>
      <span>All</span>&nbsp;posts
    </SectionHeading>
  );

  return (
    <>
      <Suspense
        fallback={
          <PostGridSectionSkeleton cardNumber={6} withViewMoreLink={false}>
            {sectionHeading}
          </PostGridSectionSkeleton>
        }
      >
        <PostGridSection queryParams='' withViewMoreLink={false}>
          {sectionHeading}
        </PostGridSection>
      </Suspense>
    </>
  );
};

export default PostsPage;

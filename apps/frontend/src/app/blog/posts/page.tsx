import { Suspense } from 'react';
import type { Metadata } from 'next';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description:
    'Browse through all the blog posts available on this website to find content you are interested in.',
};

const PostsPage = ({
  searchParams,
}: {
  searchParams?: { page?: string; s?: string };
}) => {
  const sectionHeading = (
    <SectionHeading>
      <span>All</span>&nbsp;posts
    </SectionHeading>
  );

  return (
    <>
      <Suspense
        fallback={
          <PostGridSectionSkeleton cardNumber={6} withViewAllLink={false}>
            {sectionHeading}
          </PostGridSectionSkeleton>
        }
      >
        <PaginatedPostGridSection searchParams={searchParams} queryParams=''>
          {sectionHeading}
        </PaginatedPostGridSection>
      </Suspense>
    </>
  );
};

export default PostsPage;

import { Suspense } from 'react';
import type { Metadata } from 'next';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import { getOneTag } from '@/lib/requests/tagRequests';

export const generateMetadata = async ({
  params,
}: {
  params: { tagSlug: string };
}): Promise<Metadata> => {
  const tag = await getOneTag(params.tagSlug);

  return {
    title: tag.tagName,
    description: 'Browse through all the blog posts associated with this tag.',
  };
};

const TagPage = async ({
  params: { tagSlug },
  searchParams,
}: {
  params: { tagSlug: string };
  searchParams?: { page?: string; s?: string };
}) => {
  const tag = await getOneTag(tagSlug);

  return (
    <Suspense
      fallback={
        <PostGridSectionSkeleton cardNumber={6} withViewAllLink={false}>
          <SectionHeading>
            <span>Tag</span>
          </SectionHeading>
        </PostGridSectionSkeleton>
      }
    >
      <PaginatedPostGridSection
        queryParams={`?tag=${tagSlug}`}
        searchParams={searchParams}
        noResultMessage='There are no posts with this tag.'
      >
        <SectionHeading>
          <span>Tag</span>&nbsp;{tag.tagName}
        </SectionHeading>
      </PaginatedPostGridSection>
    </Suspense>
  );
};

export default TagPage;

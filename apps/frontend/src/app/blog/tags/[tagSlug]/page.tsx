import { Suspense } from 'react';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import { getOneTag } from '@/lib/requests/tagRequests';

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

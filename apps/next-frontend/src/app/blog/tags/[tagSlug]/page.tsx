import { Suspense } from 'react';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import { getOneTag } from '@/lib/requests/tagRequests';

const TagPage = async ({
  params: { tagSlug },
}: {
  params: { tagSlug: string };
}) => {
  const tag = await getOneTag(tagSlug);

  return (
    <Suspense
      fallback={
        <PostGridSectionSkeleton cardNumber={6} withViewMoreLink={false}>
          <SectionHeading>
            <span>Tag</span>
          </SectionHeading>
        </PostGridSectionSkeleton>
      }
    >
      <PostGridSection
        queryParams={`?tag=${tagSlug}`}
        withViewMoreLink={false}
        noResultMessage='There are no posts with this tag.'
      >
        <SectionHeading>
          <span>Tag</span>&nbsp;{tag.tagName}
        </SectionHeading>
      </PostGridSection>
    </Suspense>
  );
};

export default TagPage;

import PostGridSection from '@/components/PostGridSection/PostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import { getOneTag } from '@/lib/requests/tagRequests';

const TagPage = async ({
  params: { tagSlug },
}: {
  params: { tagSlug: string };
}) => {
  const tag = await getOneTag(tagSlug);

  return (
    <PostGridSection
      queryParams={`?tag=${tagSlug}`}
      withViewMoreLink={false}
      noResultMessage='There are no posts with this tag.'
    >
      <SectionHeading>
        <span>Tag</span>&nbsp;{tag.tagName}
      </SectionHeading>
    </PostGridSection>
  );
};

export default TagPage;

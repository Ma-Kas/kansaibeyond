import PostGridSection from '@/components/PostGridSection/PostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import NoPosts from '@/components/NoPosts/NoPosts';
import { getOneTag } from '@/lib/requests/tagRequests';
import { getAllPosts } from '@/lib/requests/postRequests';

const TagPage = async ({
  params: { tagSlug },
}: {
  params: { tagSlug: string };
}) => {
  const tag = await getOneTag(tagSlug);
  const posts = await getAllPosts(`?tag=${tagSlug}`);

  return (
    <>
      {posts.length !== 0 && (
        <PostGridSection posts={posts} withViewMoreLink={false}>
          <SectionHeading>
            <span>Tag</span>&nbsp;{tag.tagName}
          </SectionHeading>
        </PostGridSection>
      )}
      {posts.length === 0 && (
        <NoPosts message='There are no posts with this tag.'>
          <SectionHeading>
            <span>explore</span>&nbsp;posts
          </SectionHeading>
        </NoPosts>
      )}
    </>
  );
};

export default TagPage;

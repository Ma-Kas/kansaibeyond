import PostGridSection from '@/components/PostGridSection/PostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryBanner from '@/components/CategoryBanner/CategoryBanner';
import NoPosts from '@/components/NoPosts/NoPosts';
import { getAllPosts } from '@/lib/requests/postRequests';

import classes from './category.module.css';

const CategoryPage = async ({
  params: { categorySlug },
}: {
  params: { categorySlug: string };
}) => {
  const posts = await getAllPosts(`?category=${categorySlug}`);

  return (
    <>
      <section className={classes['category_banner_section']}>
        <CategoryBanner categorySlug={categorySlug} />
      </section>
      {posts.length !== 0 && (
        <PostGridSection posts={posts} withViewMoreLink={false}>
          <SectionHeading>
            <span>explore</span>&nbsp;posts
          </SectionHeading>
        </PostGridSection>
      )}
      {posts.length === 0 && (
        <NoPosts message='There are no posts in this category yet.'>
          <SectionHeading>
            <span>explore</span>&nbsp;posts
          </SectionHeading>
        </NoPosts>
      )}
    </>
  );
};

export default CategoryPage;

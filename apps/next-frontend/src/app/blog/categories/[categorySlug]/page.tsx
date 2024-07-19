import { Suspense } from 'react';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryBanner from '@/components/CategoryBanner/CategoryBanner';
import CategoryBannerSkeleton from '@/components/Skeletons/CategoryBannerSkeleton';

import classes from './category.module.css';

const CategoryPage = ({
  params: { categorySlug },
}: {
  params: { categorySlug: string };
}) => {
  return (
    <>
      <section className={classes['category_banner_section']}>
        <Suspense fallback={<CategoryBannerSkeleton />}>
          <CategoryBanner categorySlug={categorySlug} />
        </Suspense>
      </section>

      <PostGridSection
        queryParams={`?category=${categorySlug}`}
        withViewMoreLink={false}
        noResultMessage='There are no posts in this category yet.'
      >
        <SectionHeading>
          <span>explore</span>&nbsp;posts
        </SectionHeading>
      </PostGridSection>
    </>
  );
};

export default CategoryPage;

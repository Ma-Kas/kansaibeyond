import { Suspense } from 'react';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryBanner from '@/components/CategoryBanner/CategoryBanner';
import CategoryBannerSkeleton from '@/components/Skeletons/CategoryBannerSkeleton';

import classes from './category.module.css';

const CategoryPage = ({
  params: { categorySlug },
  searchParams,
}: {
  params: { categorySlug: string };
  searchParams?: { page?: string; s?: string };
}) => {
  return (
    <>
      <section className={classes['category_banner_section']}>
        <Suspense fallback={<CategoryBannerSkeleton />}>
          <CategoryBanner categorySlug={categorySlug} />
        </Suspense>
      </section>

      <PaginatedPostGridSection
        queryParams={`?category=${categorySlug}`}
        searchParams={searchParams}
        noResultMessage='There are no posts in this category yet.'
      >
        <SectionHeading>
          <span>explore</span>&nbsp;posts
        </SectionHeading>
      </PaginatedPostGridSection>
    </>
  );
};

export default CategoryPage;

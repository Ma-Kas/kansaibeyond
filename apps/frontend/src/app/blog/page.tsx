import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  SectionHeading,
  MainSectionHeading,
} from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import CategoryGridSectionSkeleton from '@/components/CategoryGridSection/CategoryGridSkeleton';
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';
import FeaturedPostSkeleton from '@/components/Skeletons/FeaturedPostSkeleton';

import classes from './blog.module.css';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    "An overview of all the most recent content on this blog. Find what's new and exciting.",
};

const BlogHubPage = () => {
  const postsSectionHeading = (
    <SectionHeading>
      <span>recent</span>&nbsp;posts
    </SectionHeading>
  );
  const categorySectionHeading = (
    <SectionHeading>
      <span>explore</span>&nbsp;categories
    </SectionHeading>
  );

  return (
    <>
      <section className={classes['featured_post_section']}>
        <MainSectionHeading>
          <span>Featured</span>&nbsp;post
        </MainSectionHeading>
        <Suspense fallback={<FeaturedPostSkeleton />}>
          <FeaturedPost queryParam='?limit=1' />
        </Suspense>
      </section>
      {/* Post Card Grid */}
      <Suspense
        fallback={
          <PostGridSectionSkeleton cardNumber={6} withViewAllLink={true}>
            {postsSectionHeading}
          </PostGridSectionSkeleton>
        }
      >
        <PostGridSection queryParams='?limit=6&offset=1' withViewAllLink={true}>
          {postsSectionHeading}
        </PostGridSection>
      </Suspense>
      {/* Category Card Grid */}
      <Suspense
        fallback={
          <CategoryGridSectionSkeleton>
            {categorySectionHeading}
          </CategoryGridSectionSkeleton>
        }
      >
        <CategoryGridSection>{categorySectionHeading}</CategoryGridSection>
      </Suspense>
    </>
  );
};

export default BlogHubPage;

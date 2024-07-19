import { Suspense } from 'react';
import { getAllPosts } from '@/lib/requests/postRequests';

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import CategoryGridSectionSkeleton from '@/components/CategoryGridSection/CategoryGridSkeleton';
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';
import FeaturedPostSkeleton from '@/components/Skeletons/FeaturedPostSkeleton';

import classes from './blog.module.css';

const BlogHubPage = async () => {
  const posts = await getAllPosts('?limit=6&offset=1');
  const categorySectionHeading = (
    <SectionHeading>
      <span>explore</span>&nbsp;categories
    </SectionHeading>
  );

  return (
    <>
      <section className={classes['featured_post_section']}>
        <SectionHeading>
          <span>Featured</span>&nbsp;post
        </SectionHeading>
        <Suspense fallback={<FeaturedPostSkeleton />}>
          <FeaturedPost queryParam='?limit=1' />
        </Suspense>
      </section>
      {/* Post Card Grid */}
      <PostGridSection posts={posts} withViewMoreLink={true}>
        <SectionHeading>
          <span>recent</span>&nbsp;posts
        </SectionHeading>
      </PostGridSection>
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

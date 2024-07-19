import { Suspense } from 'react';
import { getAllPosts } from '@/lib/requests/postRequests';

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import CategoryGridSectionSkeleton from '@/components/CategoryGridSection/CategoryGridSkeleton';
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';

import classes from './blog.module.css';

const BlogHubPage = async () => {
  const posts = await getAllPosts('?limit=7');
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
        <FeaturedPost post={posts[0]} />
      </section>
      {/* Post Card Grid */}
      <PostGridSection posts={posts.slice(1)} withViewMoreLink={true}>
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

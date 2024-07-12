import { getAllPosts } from '@/lib/requests/postRequests';

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';

import classes from './blog.module.css';

const BlogHubPage = async () => {
  const posts = await getAllPosts('?limit=7');

  return (
    <>
      <section className={classes['featured_post_section']}>
        <SectionHeading>
          <span>Featured</span>&nbsp;post
        </SectionHeading>
        <FeaturedPost post={posts[0]} />
      </section>
      <PostGridSection posts={posts.slice(1)} withViewMoreLink={true}>
        <SectionHeading>
          <span>recent</span>&nbsp;posts
        </SectionHeading>
      </PostGridSection>
      <CategoryGridSection>
        <SectionHeading>
          <span>explore</span>&nbsp;categories
        </SectionHeading>
      </CategoryGridSection>
    </>
  );
};

export default BlogHubPage;

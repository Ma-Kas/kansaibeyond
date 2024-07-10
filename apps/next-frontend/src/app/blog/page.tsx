import Link from 'next/link';
import { getAllCategoriesList } from '@/lib/requests/categoryRequests';
import { getAllPosts } from '@/lib/requests/postRequests';

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';
import PostCard from '@/components/PostCard/PostCard';
import CategoryCard from '@/components/CategoryCard/CategoryCard';

import classes from './blog.module.css';

const BlogHubPage = async () => {
  const posts = await getAllPosts();
  const categories = await getAllCategoriesList();

  return (
    <>
      <section className={classes['featured_post_section']}>
        <SectionHeading>
          <span>Featured</span>&nbsp;post
        </SectionHeading>
        <FeaturedPost post={posts[8]} />
      </section>
      <section className={classes['recent_post_list_section']}>
        <SectionHeading>
          <span>recent</span>&nbsp;posts
        </SectionHeading>
        <div className={classes['recent_post_cards_container']}>
          {posts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
        <div className={classes['link_container_all_posts']}>
          <Link href={'/blog/posts'}>VIEW ALL POSTS</Link>
        </div>
      </section>
      <section className={classes['category_list_section']}>
        <SectionHeading>
          <span>explore</span>&nbsp;categories
        </SectionHeading>
        <div className={classes['category_cards_container']}>
          {categories.map((category) => {
            return <CategoryCard key={category.id} category={category} />;
          })}
        </div>
      </section>
    </>
  );
};

export default BlogHubPage;

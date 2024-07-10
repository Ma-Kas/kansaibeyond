import { getAllCategoriesList } from '@/lib/requests/categoryRequests';
import { getAllPosts } from '@/lib/requests/postRequests';
import PostCard from '@/components/PostCard/PostCard';
import CategoryCard from '@/components/CategoryCard/CategoryCard';

import classes from './blog.module.css';
import Link from 'next/link';

const BlogHubPage = async () => {
  const posts = await getAllPosts();
  const categories = await getAllCategoriesList();

  return (
    <>
      <section className={classes['recent_post_list_section']}>
        <h2>
          <span>recent</span>&nbsp;posts
        </h2>
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
        <h2>
          <span>explore</span>&nbsp;categories
        </h2>
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

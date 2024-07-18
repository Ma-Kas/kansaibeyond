import { ReactNode } from 'react';
import Link from 'next/link';
import PostCard from '../PostCard/PostCard';
import { PostForList } from '@/lib/requests/postRequests';

import classes from './PostGridSection.module.css';

type Props = {
  posts: PostForList[];
  withViewMoreLink: boolean;
  children?: ReactNode;
};

const PostGridSection = ({ posts, withViewMoreLink, children }: Props) => {
  return (
    <section className={classes['post_grid_section']}>
      {children}
      <div className={classes['post_cards_container']}>
        {posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
      {withViewMoreLink && (
        <div className={classes['all_posts_link']}>
          <Link href={'/blog/posts'}>VIEW ALL POSTS</Link>
        </div>
      )}
    </section>
  );
};

export default PostGridSection;

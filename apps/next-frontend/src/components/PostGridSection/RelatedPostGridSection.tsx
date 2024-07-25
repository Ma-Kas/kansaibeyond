import { ReactNode } from 'react';
import PostCard from '../PostCard/PostCard';
import { PostForList } from '@/lib/requests/postRequests';

import classes from './PostGridSection.module.css';

type Props = {
  posts: PostForList[];
  children?: ReactNode;
};

const RelatedPostGridSection = ({ posts, children }: Props) => {
  return (
    <section className={classes['post_grid_section']}>
      {children}
      <div className={classes['post_cards_container']}>
        {posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
    </section>
  );
};

export default RelatedPostGridSection;

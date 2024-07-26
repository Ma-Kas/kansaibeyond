import { ReactNode } from 'react';
import Link from 'next/link';
import PostCard from '../PostCard/PostCard';
import NoPosts from '../NoPosts/NoPosts';
import SectionHeading from '../SectionHeading/SectionHeading';
import { getAllPosts } from '@/lib/requests/postRequests';

import classes from './PostGridSection.module.css';

type Props = {
  withViewAllLink: boolean;
  queryParams: string;
  noResultMessage?: string;
  children?: ReactNode;
};

const PostGridSection = async ({
  withViewAllLink,
  queryParams,
  noResultMessage,
  children,
}: Props) => {
  const { rows: posts } = await getAllPosts(queryParams);

  if (noResultMessage) {
    return (
      <>
        {posts.length !== 0 && (
          <section className={classes['post_grid_section']}>
            {children}
            <div className={classes['post_cards_container']}>
              {posts.map((post) => {
                return <PostCard key={post.id} post={post} />;
              })}
            </div>
            {withViewAllLink && (
              <div className={classes['all_posts_link']}>
                <Link href={'/blog/posts?page=1'}>VIEW ALL POSTS</Link>
              </div>
            )}
          </section>
        )}
        {posts.length === 0 && (
          <NoPosts message={noResultMessage}>
            <SectionHeading>
              <span>explore</span>&nbsp;posts
            </SectionHeading>
          </NoPosts>
        )}
      </>
    );
  } else {
    return (
      <section className={classes['post_grid_section']}>
        {children}
        <div className={classes['post_cards_container']}>
          {posts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
        {withViewAllLink && (
          <div className={classes['all_posts_link']}>
            <Link href={'/blog/posts?page=1'}>VIEW ALL POSTS</Link>
          </div>
        )}
      </section>
    );
  }
};

export default PostGridSection;

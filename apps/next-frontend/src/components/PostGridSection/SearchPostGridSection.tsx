import { ReactNode } from 'react';
import Link from 'next/link';
import PostCard from '../PostCard/PostCard';
import { getSearchPosts } from '@/lib/requests/postRequests';

import classes from './PostGridSection.module.css';
import NoPosts from '../NoPosts/NoPosts';
import SectionHeading from '../SectionHeading/SectionHeading';

type Props = {
  withViewAllLink: boolean;
  query: string;
  noResultMessage?: string;
  children?: ReactNode;
};

const SearchPostGridSection = async ({
  withViewAllLink,
  query,
  noResultMessage,
  children,
}: Props) => {
  const { rows: posts } = await getSearchPosts(query);

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
              <span>Found</span>&nbsp;posts
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

export default SearchPostGridSection;

import { ReactNode } from 'react';
import PostCardSkeleton from '../Skeletons/PostCardSkeleton';
import classes from './PostGridSection.module.css';
import Link from 'next/link';

type Props = {
  cardNumber: number;
  withViewMoreLink: boolean;
  children?: ReactNode;
};

const PostGridSectionSkeleton = ({
  cardNumber,
  withViewMoreLink,
  children,
}: Props) => {
  return (
    <section className={classes['post_grid_section']}>
      {children}
      <div className={classes['post_cards_container']}>
        {[...Array(cardNumber).keys()].map((value) => {
          return <PostCardSkeleton key={value} cardNo={value} />;
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

export default PostGridSectionSkeleton;

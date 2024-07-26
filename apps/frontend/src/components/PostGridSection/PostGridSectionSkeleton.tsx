import { ReactNode } from 'react';
import PostCardSkeleton from '../Skeletons/PostCardSkeleton';
import classes from './PostGridSection.module.css';
import Link from 'next/link';

type Props = {
  cardNumber: number;
  withViewAllLink: boolean;
  children?: ReactNode;
};

const PostGridSectionSkeleton = ({
  cardNumber,
  withViewAllLink,
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
      {withViewAllLink && (
        <div className={classes['all_posts_link']}>
          <Link href={'/blog/posts?page=1'}>VIEW ALL POSTS</Link>
        </div>
      )}
    </section>
  );
};

export default PostGridSectionSkeleton;

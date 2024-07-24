import classes from './Skeletons.module.css';

const PostCardSkeleton = ({ key }: { key: number }) => {
  return (
    <article key={key} className={`${classes['post_card']} ${classes.shimmer}`}>
      <div className={classes['post_card_image']}>
        <div className={classes['post_card_title']}>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={classes['post_card_bottom']}>
        <div></div>
        <div></div>
      </div>
    </article>
  );
};

export default PostCardSkeleton;

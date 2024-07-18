import classes from './Skeletons.module.css';

const FeaturedPostSkeleton = () => {
  return (
    <article className={classes['featured_post']}>
      <div
        className={`${classes['featured_post_image']} ${classes['shimmer']}`}
      >
        <div className={classes['featured_post_title']}>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={classes['featured_post_bottom']}>
        <div></div>
        <div></div>
      </div>
    </article>
  );
};

export default FeaturedPostSkeleton;

import classes from './Skeletons.module.css';

const CategoryBannerSkeleton = () => {
  return (
    <article className={`${classes['category_banner']} ${classes.shimmer}`}>
      <div></div>
      <div></div>
    </article>
  );
};

export default CategoryBannerSkeleton;

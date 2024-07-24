import classes from './Skeletons.module.css';

const CategoryCardSkeleton = ({ key }: { key: number }) => {
  return (
    <article
      key={key}
      className={`${classes['category_card']} ${classes.shimmer}`}
    >
      <div className={classes['category_card_image']}></div>
      <div className={classes['category_card_bottom']}>
        <div></div>
      </div>
    </article>
  );
};

export default CategoryCardSkeleton;

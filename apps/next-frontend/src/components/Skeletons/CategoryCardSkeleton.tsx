import classes from './Skeletons.module.css';

const CategoryCardSkeleton = ({ cardNo }: { cardNo: number }) => {
  return (
    <article
      key={cardNo}
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

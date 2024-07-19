import classes from './Skeletons.module.css';

const AffiliateCardSkeleton = () => {
  return (
    <article className={`${classes['affiliate_card']} ${classes['shimmer']}`}>
      <div className={classes['affiliate_content']}>
        <div></div>
        <div></div>
      </div>
    </article>
  );
};

export default AffiliateCardSkeleton;

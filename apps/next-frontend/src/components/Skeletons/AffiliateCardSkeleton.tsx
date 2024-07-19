import classes from './Skeletons.module.css';

const AffiliateCardSkeleton = () => {
  return (
    <article className={`${classes['affiliate_card']} ${classes['shimmer']}`}>
      <div></div>
      <div></div>
    </article>
  );
};

export default AffiliateCardSkeleton;

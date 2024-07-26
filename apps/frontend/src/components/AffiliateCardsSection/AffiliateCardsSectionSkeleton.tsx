import AffiliateCardSkeleton from '../Skeletons/AffiliateCardSkeleton';
import classes from './AffiliateCardsSection.module.css';

const AffiliateCardsSectionSkeleton = () => {
  return (
    <section className={classes['affiliate_cards_section']}>
      {[...Array(4).keys()].map((value) => {
        return <AffiliateCardSkeleton key={value} />;
      })}
    </section>
  );
};

export default AffiliateCardsSectionSkeleton;

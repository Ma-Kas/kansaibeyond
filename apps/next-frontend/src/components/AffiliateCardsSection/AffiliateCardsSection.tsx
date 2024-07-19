import { getAllAffiliates } from '@/lib/requests/affiliateRequests';
import AffiliateCard from '../AffiliateCard/AffiliateCard';

import classes from './AffiliateCardsSection.module.css';

const AffiliateCardsSection = async () => {
  const affiliates = await getAllAffiliates();

  return (
    <section className={classes['affiliate_cards_section']}>
      {affiliates.map((affiliate) => {
        return <AffiliateCard key={affiliate.id} affiliate={affiliate} />;
      })}
    </section>
  );
};

export default AffiliateCardsSection;

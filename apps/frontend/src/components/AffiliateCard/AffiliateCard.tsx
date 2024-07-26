import { Affiliate } from '@/lib/requests/affiliateRequests';

import classes from './AffiliateCard.module.css';

const AffiliateCard = ({ affiliate }: { affiliate: Affiliate }) => {
  return (
    <article className={classes['card_container']}>
      <a
        className={classes['card_link_container']}
        title={affiliate.blogUrl}
        href={affiliate.blogUrl}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`Visit Blog: ${affiliate.blogName}`}
      >
        <div className={classes['card_content']}>
          <h2>{affiliate.blogName}</h2>
          <p>{affiliate.blogDescription}</p>
        </div>
      </a>
    </article>
  );
};

export default AffiliateCard;

import SectionHeading from '@/components/SectionHeading/SectionHeading';
import AffiliateCard from '@/components/AffiliateCard/AffiliateCard';
import { KANSAIBEYOND_EMAIL } from '@/config/constants';
import { getAllAffiliates } from '@/lib/requests/affiliateRequests';

import classes from './JapanSites.module.css';

const JapanSitesPage = async () => {
  const affiliates = await getAllAffiliates();

  return (
    <>
      <section className={classes['banner_section']}>
        <article className={classes['banner_content']}>
          <SectionHeading>
            <span>Japan</span>&nbsp;Blog Affiliates
          </SectionHeading>
          <p>
            For those surfing the Japan interweb looking for more reading
            material, you&apos;ve come to the right place. Scroll away!
          </p>
          <p>
            <strong>
              Please note that the opinions and voices of these bloggers are
              theirs alone, and does not reflect those of Kansai & Beyond.
            </strong>
          </p>
          <p>
            If you come across any troubling content,&nbsp;
            <a
              title={`mailto:${KANSAIBEYOND_EMAIL}`}
              href={`mailto:${KANSAIBEYOND_EMAIL}?subject=J-Blog Content Issues`}
            >
              please contact me.
            </a>
          </p>
          <a
            className={classes['button_link']}
            title='Become an affiliate here'
            href={`mailto:${KANSAIBEYOND_EMAIL}?subject=J-Blog Affiliate Submission`}
            aria-label='Become an affiliate here'
          >
            <span>Have a blog? Join the list!</span>
          </a>
        </article>
      </section>
      <section className={classes['affiliate_cards_section']}>
        {affiliates.map((affiliate) => {
          return <AffiliateCard key={affiliate.id} affiliate={affiliate} />;
        })}
      </section>
    </>
  );
};

export default JapanSitesPage;

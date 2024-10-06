'use client';

import { MainSectionHeading } from '@/components/SectionHeading/SectionHeading';
import PostGridError from '@/components/ErrorPages/PostGridError';
import { KANSAIBEYOND_EMAIL } from '@/config/constants';

import classes from './JapanSites.module.css';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest: string };
  reset: () => void;
}) => {
  return (
    <>
      <section className={classes['banner_section']}>
        <article className={classes['banner_content']}>
          <MainSectionHeading>
            <span>Japan</span>&nbsp;Blog Affiliates
          </MainSectionHeading>
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
      <PostGridError errorMessage={error.digest} reset={reset}></PostGridError>
    </>
  );
};

export default Error;

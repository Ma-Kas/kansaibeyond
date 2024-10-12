import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import {
  KANSAIBEYOND_EMAIL,
  KANSAIBEYOND_THATCH_HK_FOOD,
} from '@/config/constants';
import dimSumImage from '@public/images/hk_dim_sum_opt_a.webp';
import { dictionary } from '@/config/dictionary';

import classes from './TasteHK.module.css';

export const metadata: Metadata = {
  title: dictionary.hongKong.title,
  description: dictionary.hongKong.description,
  twitter: {
    site: './',
    card: 'summary_large_image',
    title: dictionary.hongKong.title,
    description: dictionary.hongKong.description,
    creator: '@kansaibeyond',
  },
  openGraph: {
    url: './',
    type: 'website',
    title: dictionary.hongKong.title,
    description: dictionary.hongKong.description,
  },
};

const TasteOfHKPage = () => {
  const reviewSectionHeading = (
    <SectionHeading>
      <span>explore</span>&nbsp;reviews
    </SectionHeading>
  );

  return (
    <>
      <article className={classes['hero_banner']}>
        <Image
          className={classes['hero_banner_image']}
          src={dimSumImage}
          alt=''
          sizes={'(max-width: 768px) 100vw, 100vw'}
          priority={true}
          fill
          placeholder='blur'
        />
        <div className={classes['hero_banner_content']}>
          <h1>
            A Taste of<span>Hong Kong</span>
          </h1>
        </div>
      </article>

      <section className={classes['banner_section']}>
        <article className={classes['banner_content']}>
          <p>
            Here is a list of all the places in Kansai and Kanto that serve
            authentic Hong Kong foods like HK style cafes, dim sum restaurants
            and dessert places.
          </p>
          <p>
            You can scroll & click on the pins for a description of the
            restaurant.
          </p>
          <br />
          <p>
            <strong>
              If you know any places not on the list,&nbsp;
              <a
                title={`mailto:${KANSAIBEYOND_EMAIL}`}
                href={`mailto:${KANSAIBEYOND_EMAIL}?subject=HK food suggestion in Japan`}
              >
                please contact me!!.
              </a>
            </strong>
          </p>
          <a
            className={classes['button_link']}
            title='Hong Kong restaurants in Japan guide'
            href={KANSAIBEYOND_THATCH_HK_FOOD}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Hong Kong restaurants in Japan guide'
          >
            <span>View the full list here!</span>
          </a>

          <p>
            Please know that I have not tried all of these places before, so I
            cannot guarantee the taste. All I know is that they resemble more of
            what I&apos;ve had in my childhood and I encourage all of you to try
            for yourself. I also do not know what the owner&apos;s political
            alignments are. If you know anything, and can proof it - I am happy
            to put it in the descriptions. Please remember I am simply helping
            those who want a taste of home or try something authentic in Japan.
          </p>
          <br />
          <p>
            I would love to hear what you think of the places, and if you would
            like to share your thoughts, please contact me!
          </p>
        </article>
      </section>
      <Suspense
        fallback={
          <PostGridSectionSkeleton cardNumber={3} withViewAllLink={false}>
            {reviewSectionHeading}
          </PostGridSectionSkeleton>
        }
      >
        <PostGridSection
          queryParams='?tag=taste-of-hong-kong'
          withViewAllLink={false}
        >
          {reviewSectionHeading}
        </PostGridSection>
      </Suspense>
    </>
  );
};

export default TasteOfHKPage;

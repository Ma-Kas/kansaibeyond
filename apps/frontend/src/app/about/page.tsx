import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import introductionImage from '@public/images/kb_about_opt_a.webp';
import {
  KANSAIBEYOND_EMAIL,
  KANSAIBEYOND_THATCH,
  KANSAIBEYOND_TWITTER_HANDLE,
  SITENAME,
} from '@/config/constants';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';
import FeaturedPostSkeleton from '@/components/Skeletons/FeaturedPostSkeleton';
import { dictionary } from '@/config/dictionary';

import classes from './about.module.css';

export const metadata: Metadata = {
  title: dictionary.about.title,
  description: dictionary.about.description,
  twitter: {
    site: KANSAIBEYOND_TWITTER_HANDLE,
    card: 'summary_large_image',
    title: dictionary.about.title,
    description: dictionary.about.description,
    creator: KANSAIBEYOND_TWITTER_HANDLE,
  },
  openGraph: {
    url: './',
    siteName: SITENAME,
    type: 'website',
    title: dictionary.about.title,
    description: dictionary.about.description,
  },
};

const AboutPage = () => {
  return (
    <>
      <section className={classes['introduction_section']}>
        <figure className={classes['introduction_section_image_container']}>
          <Image
            className={classes['introduction_section_bg_image']}
            src={introductionImage}
            alt=''
            sizes={'(max-width: 768px) 100vw, (max-width: 1440px) 60vw, 850px'}
            priority={true}
            placeholder='blur'
          />
        </figure>
        <article className={classes['introduction_content_container']}>
          <div className={classes['introduction_content']}>
            <h1>
              <span>Hi there!</span>
              <span>I&apos;m Jenny</span>
            </h1>
            <p>aka the &quot;Panda Kansai&quot;</p>
            <p>
              I&apos;m a Japan travel enthusiast, and have experience solo
              traveling and using different modes of transportation all across
              Japan. It took me 7 years to make it to all 47 prefectures, and I
              want to share with you all my knowledge!
            </p>
            <p>
              On top of this, I was a homeroom teacher in Japan for a few years
              and for those who want to know what it&apos;s like to truly teach
              in Japan, I want to share my life with you too!
            </p>
            <p>I hope you enjoy my website & my writing!</p>
            <p>
              contact us:
              <br />
              <a
                title={`mailto:${KANSAIBEYOND_EMAIL}`}
                href={`mailto:${KANSAIBEYOND_EMAIL}`}
              >
                {KANSAIBEYOND_EMAIL}
              </a>
            </p>
          </div>
        </article>
      </section>
      <section className={classes['hire_me_section']}>
        <article className={classes['hire_me_content']}>
          <SectionHeading>
            <span>Need</span>&nbsp;Travel Help?
          </SectionHeading>
          <p>
            Visit my travel services pages on thatch.co and get inspired! Or,
            hire me to get personalized recommendations tailored to all your
            needs!!
          </p>
          <a
            className={classes['button_link']}
            title='Thatch.co Travel Guides'
            href={KANSAIBEYOND_THATCH}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Hire me here'
          >
            <span>Hire me here</span>
          </a>
        </article>
      </section>
      <section className={classes['more_about_section']}>
        <SectionHeading>
          Read my<span>&nbsp;story</span>
        </SectionHeading>
        <Suspense fallback={<FeaturedPostSkeleton />}>
          <FeaturedPost queryParam='?post_slug=my-japan-story' />
        </Suspense>
      </section>
    </>
  );
};

export default AboutPage;

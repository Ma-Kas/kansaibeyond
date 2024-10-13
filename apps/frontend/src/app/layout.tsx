import { Suspense } from 'react';
import type { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import Header from '@/components/Header/Header';
import SocialMediaReel from '@/components/SocialMediaReel/SocialMediaReel';
import SocialMediaReelSkeleton from '@/components/SocialMediaReel/SocialMediaReelSkeleton';
import Footer from '@/components/Footer/Footer';
import ConsentBanner from '@/components/ConsentBanner/ConsentBanner';
import {
  FRONTEND_BASE_URL,
  GOOGLE_SITE_VERIFICATION,
  GOOGLE_TAG_MANAGER_CONTAINER_ID,
  KANSAIBEYOND_TWITTER_HANDLE,
  SITENAME,
} from '@/config/constants';

import {
  futuraLtLight,
  futuraLtBook,
  geistRegular,
  geistLight,
  latoRegular,
  latoLight,
  madefor,
  robotoRegular,
  robotoLight,
  ivyMode,
  handwriting,
} from '@/styles/fonts';

import '@/styles/index.css';
import '@/styles/variables.css';
import '@/styles/post-transform-variables.css';
import { dictionary } from '@/config/dictionary';

import classes from './page.module.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Kansai & Beyond',
    default: dictionary.home.title,
  },
  description: dictionary.home.description,
  metadataBase: new URL(FRONTEND_BASE_URL),
  verification: { google: GOOGLE_SITE_VERIFICATION },
  twitter: {
    site: KANSAIBEYOND_TWITTER_HANDLE,
    card: 'summary_large_image',
    title: {
      template: '%s | Kansai & Beyond',
      default: dictionary.home.title,
    },
    description: dictionary.home.description,
    creator: KANSAIBEYOND_TWITTER_HANDLE,
  },
  openGraph: {
    url: FRONTEND_BASE_URL,
    siteName: SITENAME,
    type: 'website',
    title: {
      template: '%s | Kansai & Beyond',
      default: dictionary.home.title,
    },
    description: dictionary.home.description,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_CONTAINER_ID} />
      <body
        className={`${futuraLtLight.variable} 
        ${futuraLtBook.variable} 
        ${geistRegular.variable} 
        ${geistLight.variable} 
        ${latoRegular.variable} 
        ${latoLight.variable} 
        ${madefor.variable} 
        ${robotoRegular.variable} 
        ${robotoLight.variable} 
        ${ivyMode.variable} 
        ${handwriting.variable}`}
      >
        <Header />
        <main className={classes['page_main']}>{children}</main>
        <Suspense fallback={<SocialMediaReelSkeleton />}>
          <SocialMediaReel />
        </Suspense>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
};

export default RootLayout;

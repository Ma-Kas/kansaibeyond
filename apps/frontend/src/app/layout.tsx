import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import SocialMediaReel from '@/components/SocialMediaReel/SocialMediaReel';
import SocialMediaReelSkeleton from '@/components/SocialMediaReel/SocialMediaReelSkeleton';
import Footer from '@/components/Footer/Footer';
import { FRONTEND_BASE_URL } from '@/config/constants';

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

import classes from './page.module.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Kansai & Beyond',
    default: 'Kansai & Beyond',
  },
  description:
    "Kansai & Beyond is a blog site documenting life in Japan, photography, tips for traveling and how it's like working as an English Teacher.",
  metadataBase: new URL(FRONTEND_BASE_URL),
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
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
      </body>
    </html>
  );
};

export default RootLayout;

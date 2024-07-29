import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

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
  title: 'Kansai & Beyond',
  description: 'A Japan blog and travel guide website.',
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
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;

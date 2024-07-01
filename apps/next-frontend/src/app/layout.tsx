import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
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
      <body>
        <Header />
        <main className={classes['page_main']}>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;

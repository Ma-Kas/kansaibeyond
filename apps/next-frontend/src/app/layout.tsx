import type { Metadata } from 'next';
// import Script from 'next/script';
// import { INSTAGRAM_SCRIPT_URL } from '@/config/constants';
import '@/styles/index.css';
import '@/styles/variables.css';

export const metadata: Metadata = {
  title: 'Kansai & Beyond',
  description: 'A Japan travel blog and travel guide website.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <body>
        {children}
        {/* <Script src={INSTAGRAM_SCRIPT_URL} strategy='beforeInteractive' /> */}
      </body>
    </html>
  );
};

export default RootLayout;

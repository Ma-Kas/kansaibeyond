import type { Metadata } from 'next';
import '@/styles/index.css';

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
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;

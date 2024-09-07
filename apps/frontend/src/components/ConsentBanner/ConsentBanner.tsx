import { cookies } from 'next/headers';
import ConsentBannerClient from './ConsentBannerClient';

const ConsentBanner = () => {
  // Get cookie in wrapper server component to pass to client component
  const cookieStore = cookies();
  const consentCookie = cookieStore.get('consentCookie');

  return (
    <>
      <ConsentBannerClient consentCookie={consentCookie} />
    </>
  );
};

export default ConsentBanner;

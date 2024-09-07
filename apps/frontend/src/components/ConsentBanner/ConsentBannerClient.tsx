'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import setConsentCookie from '@/actions/set-cookie';

import classes from './ConsentBanner.module.css';

type Props = {
  consentCookie: RequestCookie | undefined;
};

const ConsentBannerClient = ({ consentCookie }: Props) => {
  // useState technically unnecessary, only for smoother UI to immediately hide
  // cookie banner instead of waiting for server action response
  const [consent, setConsent] = useState(consentCookie !== undefined);

  const handleConsentCookie = (value: boolean) => {
    setConsent(true);
    setConsentCookie(value);
  };

  return (
    <>
      {!consent && (
        <section className={classes.banner}>
          <p className={classes.content}>
            We use essential cookies to bring you our content and to offer a
            better website experience. <br />
            We&apos;d like to use other cookies to analyse our website&apos;s
            performance and learn more about what our users like, but only if
            you accept.
            <br />
            Learn more about your choices in our&nbsp;
            <Link href={'/privacy-policy'}>privacy policy</Link>
          </p>

          <div className={classes.buttons}>
            <button
              id='consent_all_cookies'
              onClick={() => handleConsentCookie(true)}
              aria-label='Accept all cookies'
            >
              Accept All
            </button>
            <button
              id='consent_essential_cookies'
              onClick={() => handleConsentCookie(false)}
              aria-label='Accept only essential cookies'
            >
              Essential Only
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default ConsentBannerClient;

'use server';

import { cookies } from 'next/headers';
import { COOKIE_DOMAIN } from '@/config/constants';

const setConsentCookie = (value: boolean) => {
  cookies().set({
    name: 'consentCookie',
    value: `${value}`,
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'none',
    path: '/',
    domain: COOKIE_DOMAIN,
  });
};

export default setConsentCookie;

'use server';

import { cookies } from 'next/headers';

const setConsentCookie = (value: boolean) => {
  cookies().set({
    name: 'consentCookie',
    value: `${value}`,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
};

export default setConsentCookie;

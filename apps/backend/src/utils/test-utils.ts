import { Response } from 'supertest';

const extractCookieFromResponse = (response: Response): string => {
  const setCookie = response.headers['set-cookie'][0];
  return setCookie.substring(0, setCookie.indexOf(';'));
};

const extractCookieExpirationFromResponse = (response: Response): Date => {
  const setCookie = response.headers['set-cookie'][0];
  const expiresIndex = setCookie.search('Expires=');
  return new Date(
    setCookie.substring(
      setCookie.indexOf('=', expiresIndex) + 1,
      setCookie.indexOf(';', expiresIndex)
    )
  );
};

export { extractCookieFromResponse, extractCookieExpirationFromResponse };

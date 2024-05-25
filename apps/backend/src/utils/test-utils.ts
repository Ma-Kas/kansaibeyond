import { Response } from 'supertest';

const extractCookieFromResponse = (response: Response): string => {
  const setCookie = response.headers['set-cookie'][0];
  return setCookie.substring(0, setCookie.indexOf(';'));
};

export { extractCookieFromResponse };

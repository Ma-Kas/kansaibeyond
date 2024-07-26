import { cookies } from 'next/headers';

export const setSessionCookieHeader = () => {
  const cookieStore = cookies();
  const cookie = cookieStore.get('sessionId');
  return `sessionId=${cookie?.value}`;
};

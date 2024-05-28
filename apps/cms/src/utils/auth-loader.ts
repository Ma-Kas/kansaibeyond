import { QueryClient } from '@tanstack/react-query';
import { getAuth } from '../requests/authRequests';

export const authQuery = () => ({
  queryKey: ['auth'],
  queryFn: getAuth,
  retry: 1,
});

export const authLoader = (queryClient: QueryClient) => async () => {
  const query = authQuery();
  // return cached data or fetch it if not existing or stale
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

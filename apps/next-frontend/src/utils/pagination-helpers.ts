// Check whether page and hidden pageSize param are valid integers, otherwise
// return undefined to trigger fallback
export const isValidParam = (searchParam: unknown) => {
  if (!searchParam || typeof searchParam !== 'string') {
    return undefined;
  }

  if (Number.isNaN(searchParam) || !Number.isInteger(Number(searchParam)))
    return undefined;

  return Number(searchParam);
};

// Construct query string for the api call
// If extra query params are present (e.g. category, tag), patch those in
// otherwise pagination params only
export const constructPaginationQuery = (
  queryParams: string,
  currentPage: number,
  pageSize: number
): string => {
  const paginationParam = `limit=${pageSize}&offset=${
    (currentPage - 1) * pageSize
  }`;

  return queryParams === ''
    ? `?${paginationParam}`
    : `${queryParams}&${paginationParam}`;
};

// Return total pages based on item count as well as whether pagination is necessary
// only if totalPages > 1
export const calculatePaginationPages = (pageSize: number, count: number) => {
  const totalPages = Math.ceil(count / pageSize);
  const shouldPaginate = totalPages > 1;

  return { totalPages, shouldPaginate };
};

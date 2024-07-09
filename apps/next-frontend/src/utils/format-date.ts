import { format } from 'date-fns';

const formatShortDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

export { formatShortDate };

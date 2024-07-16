import { format } from 'date-fns';

const formatShortDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

const formatLongDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMMM dd, yyyy');
};

export { formatShortDate, formatLongDate };

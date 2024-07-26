'use client';

import DynamicErrorPage from '@/components/ErrorPages/DynamicErrorPage';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest: string };
  reset: () => void;
}) => {
  return <DynamicErrorPage errorMessage={error.digest} reset={reset} />;
};

export default Error;

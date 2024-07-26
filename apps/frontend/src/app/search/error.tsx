'use client';

import Searchbar from '@/components/Searchbar/Searchbar';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import classes from './search.module.css';
import PostGridError from '@/components/ErrorPages/PostGridError';

type Props = {
  error: Error & { digest: string };
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  const resultSectionHeading = (
    <SectionHeading>
      <span>Found</span>&nbsp;posts
    </SectionHeading>
  );

  return (
    <>
      <section className={classes['search_section_empty']}>
        <SectionHeading>
          <span>Search</span>&nbsp;for posts
        </SectionHeading>

        <Searchbar inHeader={false} />
      </section>

      <PostGridError errorMessage={error.digest} reset={reset}>
        {resultSectionHeading}
      </PostGridError>
    </>
  );
};

export default Error;

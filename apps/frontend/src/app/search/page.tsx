import { Suspense } from 'react';
import type { Metadata } from 'next';
import Searchbar from '@/components/Searchbar/Searchbar';
import SearchPostGridSection from '@/components/PostGridSection/SearchPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import classes from './search.module.css';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search our database of many exciting blog posts, for exactly the content you are most interested in.',
};

const SearchPage = ({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string; s?: string };
}) => {
  const query = searchParams?.q || '';
  const resultSectionHeading = (
    <SectionHeading>
      <span>Found</span>&nbsp;posts
    </SectionHeading>
  );

  if (query) {
    return (
      <>
        <section className={classes['search_section']}>
          <SectionHeading>
            Search Results For:
            <br />
            {`"${query}"`}
          </SectionHeading>
          <Suspense>
            <Searchbar inHeader={false} />
          </Suspense>
        </section>

        <Suspense
          fallback={
            <PostGridSectionSkeleton cardNumber={3} withViewAllLink={false}>
              {resultSectionHeading}
            </PostGridSectionSkeleton>
          }
        >
          <SearchPostGridSection
            query={query}
            searchParams={searchParams}
            noResultMessage='No posts match your search.'
          >
            {resultSectionHeading}
          </SearchPostGridSection>
        </Suspense>
      </>
    );
  } else {
    return (
      <>
        <section className={classes['search_section_empty']}>
          <SectionHeading>
            <span>Search</span>&nbsp;for posts
          </SectionHeading>

          <Searchbar inHeader={false} />
        </section>
      </>
    );
  }
};

export default SearchPage;

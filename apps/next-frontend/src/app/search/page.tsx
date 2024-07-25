import { Suspense } from 'react';
import Searchbar from '@/components/Searchbar/Searchbar';
import SearchPostGridSection from '@/components/PostGridSection/SearchPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import classes from './search.module.css';

const SearchPage = ({ searchParams }: { searchParams?: { q?: string } }) => {
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
          <Searchbar inHeader={false} />
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
            withViewAllLink={false}
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

import Searchbar from '@/components/Searchbar/Searchbar';
import SearchPostGridSection from '@/components/PostGridSection/SearchPostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

import classes from './search.module.css';

const SearchPage = ({ searchParams }: { searchParams?: { q?: string } }) => {
  const query = searchParams?.q || '';

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

        <SearchPostGridSection
          query={query}
          withViewMoreLink={false}
          noResultMessage='No posts match your search.'
        >
          <SectionHeading>
            <span>Found</span>&nbsp;posts
          </SectionHeading>
        </SearchPostGridSection>
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

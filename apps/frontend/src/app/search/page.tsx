import { Suspense } from 'react';
import type { Metadata } from 'next';
import Searchbar from '@/components/Searchbar/Searchbar';
import SearchPostGridSection from '@/components/PostGridSection/SearchPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import {
  SectionHeading,
  MainSectionHeading,
} from '@/components/SectionHeading/SectionHeading';
import { dictionary } from '@/config/dictionary';
import { KANSAIBEYOND_TWITTER_HANDLE, SITENAME } from '@/config/constants';

import classes from './search.module.css';

export const metadata: Metadata = {
  title: dictionary.search.title,
  description: dictionary.search.description,
  twitter: {
    site: KANSAIBEYOND_TWITTER_HANDLE,
    card: 'summary_large_image',
    title: dictionary.search.title,
    description: dictionary.search.description,
    creator: KANSAIBEYOND_TWITTER_HANDLE,
  },
  openGraph: {
    url: './',
    siteName: SITENAME,
    type: 'website',
    title: dictionary.search.title,
    description: dictionary.search.description,
  },
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
          <MainSectionHeading>
            Search Results For:
            <br />
            {`"${query}"`}
          </MainSectionHeading>
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
          <MainSectionHeading>
            <span>Search</span>&nbsp;for posts
          </MainSectionHeading>

          <Searchbar inHeader={false} />
        </section>
      </>
    );
  }
};

export default SearchPage;

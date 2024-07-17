import Searchbar from '@/components/Searchbar/Searchbar';
import PostGridSection from '@/components/PostGridSection/PostGridSection';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import NoPosts from '@/components/NoPosts/NoPosts';
import { getSearchPosts } from '@/lib/requests/postRequests';

import classes from './search.module.css';

const SearchPage = async ({
  searchParams,
}: {
  searchParams?: { q?: string };
}) => {
  const query = searchParams?.q || '';

  if (query) {
    const posts = await getSearchPosts(query);

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
        {posts.length !== 0 && (
          <PostGridSection posts={posts} withViewMoreLink={false}>
            <SectionHeading>
              <span>Found</span>&nbsp;posts
            </SectionHeading>
          </PostGridSection>
        )}
        {posts.length === 0 && (
          <NoPosts message='No posts match your search.'>
            <SectionHeading>
              <span>Found</span>&nbsp;posts
            </SectionHeading>
          </NoPosts>
        )}
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

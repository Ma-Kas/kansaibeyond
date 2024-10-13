import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MainSectionHeading } from '@/components/SectionHeading/SectionHeading';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import { dictionary } from '@/config/dictionary';
import { KANSAIBEYOND_TWITTER_HANDLE, SITENAME } from '@/config/constants';

export const metadata: Metadata = {
  title: dictionary.posts.title,
  description: dictionary.posts.description,
  twitter: {
    site: KANSAIBEYOND_TWITTER_HANDLE,
    card: 'summary_large_image',
    title: dictionary.posts.title,
    description: dictionary.posts.description,
    creator: KANSAIBEYOND_TWITTER_HANDLE,
  },
  openGraph: {
    url: './',
    siteName: SITENAME,
    type: 'website',
    title: dictionary.posts.title,
    description: dictionary.posts.description,
  },
};

const PostsPage = ({
  searchParams,
}: {
  searchParams?: { page?: string; s?: string };
}) => {
  const sectionHeading = (
    <MainSectionHeading>
      <span>All</span>&nbsp;posts
    </MainSectionHeading>
  );

  return (
    <>
      <Suspense
        fallback={
          <PostGridSectionSkeleton cardNumber={6} withViewAllLink={false}>
            {sectionHeading}
          </PostGridSectionSkeleton>
        }
      >
        <PaginatedPostGridSection searchParams={searchParams} queryParams=''>
          {sectionHeading}
        </PaginatedPostGridSection>
      </Suspense>
    </>
  );
};

export default PostsPage;

import { Suspense } from 'react';
import type { Metadata } from 'next';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import {
  MainSectionHeading,
  MainSectionHeadingDouble,
} from '@/components/SectionHeading/SectionHeading';
import { getOneUser } from '@/lib/requests/userRequests';
import { KANSAIBEYOND_TWITTER_HANDLE, SITENAME } from '@/config/constants';

export const generateMetadata = async ({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> => {
  const user = await getOneUser(params.username);
  await new Promise((resolve) => setTimeout(resolve, 0));

  return {
    title: `Posts by ${user.displayName}`,
    description: `Browse through all the blog posts published by ${user.displayName}`,
    twitter: {
      site: KANSAIBEYOND_TWITTER_HANDLE,
      card: 'summary_large_image',
      title: `Posts by ${user.displayName}`,
      description: `Browse through all the blog posts published by ${user.displayName}`,
      creator: KANSAIBEYOND_TWITTER_HANDLE,
    },
    openGraph: {
      url: './',
      siteName: SITENAME,
      type: 'website',
      title: `Posts by ${user.displayName}`,
      description: `Browse through all the blog posts published by ${user.displayName}`,
    },
  };
};

const UserPage = async ({
  params: { username },
  searchParams,
}: {
  params: { username: string };
  searchParams?: { page?: string; s?: string };
}) => {
  const user = await getOneUser(username);

  return (
    <Suspense
      fallback={
        <PostGridSectionSkeleton cardNumber={6} withViewAllLink={false}>
          <MainSectionHeading>
            <span>Posts by</span>
          </MainSectionHeading>
        </PostGridSectionSkeleton>
      }
    >
      <PaginatedPostGridSection
        queryParams={`?username=${username}`}
        searchParams={searchParams}
        noResultMessage='This user has not published any posts.'
      >
        <MainSectionHeadingDouble>
          <span>Posts by</span>
          <br></br>
          {user.displayName}
        </MainSectionHeadingDouble>
      </PaginatedPostGridSection>
    </Suspense>
  );
};

export default UserPage;

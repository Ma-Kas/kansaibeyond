import { Suspense } from 'react';
import type { Metadata } from 'next';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import PostGridSectionSkeleton from '@/components/PostGridSection/PostGridSectionSkeleton';
import SectionHeading, {
  SectionHeadingDouble,
} from '@/components/SectionHeading/SectionHeading';

import { getOneUser } from '@/lib/requests/userRequests';

export const generateMetadata = async ({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> => {
  const user = await getOneUser(params.username);
  await new Promise((resolve) => setTimeout(resolve, 0));

  return {
    title: user.displayName,
    description: 'Browse through all the blog posts published by this user.',
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
          <SectionHeading>
            <span>Posts by</span>
          </SectionHeading>
        </PostGridSectionSkeleton>
      }
    >
      <PaginatedPostGridSection
        queryParams={`?username=${username}`}
        searchParams={searchParams}
        noResultMessage='This user has not published any posts.'
      >
        <SectionHeadingDouble>
          <span>Posts by</span>
          <br></br>
          {user.displayName}
        </SectionHeadingDouble>
      </PaginatedPostGridSection>
    </Suspense>
  );
};

export default UserPage;

import { Suspense } from 'react';
import type { Metadata } from 'next';
import PaginatedPostGridSection from '@/components/PostGridSection/PaginatedPostGridSection';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import CategoryBanner from '@/components/CategoryBanner/CategoryBanner';
import CategoryBannerSkeleton from '@/components/Skeletons/CategoryBannerSkeleton';
import { getOneCategory } from '@/lib/requests/categoryRequests';
import {
  CLOUDINARY_BASE_URL,
  KANSAIBEYOND_TWITTER_HANDLE,
  METADATA_IMAGE_TRANSFORM,
  SITENAME,
  WSRV_BASE_URL,
} from '@/config/constants';

import classes from './category.module.css';

export const generateMetadata = async ({
  params,
}: {
  params: { categorySlug: string };
}): Promise<Metadata> => {
  const category = await getOneCategory(params.categorySlug);

  return {
    title: category.categoryName,
    description:
      'Browse through all the blog posts associated with this category.',
    twitter: {
      site: KANSAIBEYOND_TWITTER_HANDLE,
      card: 'summary_large_image',
      title: category.categoryName,
      description:
        'Browse through all the blog posts associated with this category.',
      creator: KANSAIBEYOND_TWITTER_HANDLE,
      images: [
        {
          url: new URL(
            `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${METADATA_IMAGE_TRANSFORM}${category.coverImage?.urlSlug}&output=jpg`
          ),
          alt: category.coverImage?.altText || '',
        },
      ],
    },
    openGraph: {
      url: './',
      siteName: SITENAME,
      type: 'website',
      title: category.categoryName,
      description:
        'Browse through all the blog posts associated with this category.',
      images: [
        {
          url: new URL(
            `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${METADATA_IMAGE_TRANSFORM}${category.coverImage?.urlSlug}&output=jpg`
          ),
          alt: category.coverImage?.altText || '',
        },
      ],
    },
  };
};

const CategoryPage = ({
  params: { categorySlug },
  searchParams,
}: {
  params: { categorySlug: string };
  searchParams?: { page?: string; s?: string };
}) => {
  return (
    <>
      <section className={classes['category_banner_section']}>
        <Suspense fallback={<CategoryBannerSkeleton />}>
          <CategoryBanner categorySlug={categorySlug} />
        </Suspense>
      </section>

      <PaginatedPostGridSection
        queryParams={`?category=${categorySlug}`}
        searchParams={searchParams}
        noResultMessage='There are no posts in this category yet.'
      >
        <SectionHeading>
          <span>explore</span>&nbsp;posts
        </SectionHeading>
      </PaginatedPostGridSection>
    </>
  );
};

export default CategoryPage;

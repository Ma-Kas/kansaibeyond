import { Suspense } from 'react';
import type { Metadata } from 'next';
import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import CategoryGridSectionSkeleton from '@/components/CategoryGridSection/CategoryGridSkeleton';
import { MainSectionHeading } from '@/components/SectionHeading/SectionHeading';
import { dictionary } from '@/config/dictionary';

export const metadata: Metadata = {
  title: dictionary.categories.title,
  description: dictionary.categories.description,
  twitter: {
    site: './',
    card: 'summary_large_image',
    title: dictionary.categories.title,
    description: dictionary.categories.description,
    creator: '@kansaibeyond',
  },
  openGraph: {
    url: './',
    type: 'website',
    title: dictionary.categories.title,
    description: dictionary.categories.description,
  },
};

const CategoriesPage = () => {
  const categorySectionHeading = (
    <MainSectionHeading>
      <span>explore</span>&nbsp;categories
    </MainSectionHeading>
  );

  return (
    <Suspense
      fallback={
        <CategoryGridSectionSkeleton>
          {categorySectionHeading}
        </CategoryGridSectionSkeleton>
      }
    >
      <CategoryGridSection>{categorySectionHeading}</CategoryGridSection>
    </Suspense>
  );
};

export default CategoriesPage;

import { Suspense } from 'react';
import type { Metadata } from 'next';
import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import CategoryGridSectionSkeleton from '@/components/CategoryGridSection/CategoryGridSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'An overview of all the categories available for you to find posts.',
};

const CategoriesPage = () => {
  const categorySectionHeading = (
    <SectionHeading>
      <span>explore</span>&nbsp;categories
    </SectionHeading>
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

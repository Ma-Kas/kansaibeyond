import { Suspense } from 'react';

import CategoryGridSection from '@/components/CategoryGridSection/CategoryGridSection';
import CategoryGridSectionSkeleton from '@/components/CategoryGridSection/CategoryGridSkeleton';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

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

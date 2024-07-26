import { ReactNode } from 'react';
import CategoryCardSkeleton from '../Skeletons/CategoryCardSkeleton';

import classes from './CategoryGridSection.module.css';

const CategoryGridSectionSkeleton = ({ children }: { children: ReactNode }) => {
  return (
    <section className={classes['category_grid_section']}>
      {children}
      <div className={classes['category_cards_container']}>
        {[...Array(6).keys()].map((value) => {
          return <CategoryCardSkeleton key={value} cardNo={value} />;
        })}
      </div>
    </section>
  );
};

export default CategoryGridSectionSkeleton;

import { ReactNode } from 'react';
import CategoryCard from '../CategoryCard/CategoryCard';
import { getAllCategoriesList } from '@/lib/requests/categoryRequests';

import classes from './CategoryGridSection.module.css';

const CategoryGridSection = async ({ children }: { children: ReactNode }) => {
  const categories = await getAllCategoriesList();

  return (
    <section className={classes['category_grid_section']}>
      {children}
      <div className={classes['category_cards_container']}>
        {categories.map((category) => {
          return <CategoryCard key={category.id} category={category} />;
        })}
      </div>
    </section>
  );
};

export default CategoryGridSection;

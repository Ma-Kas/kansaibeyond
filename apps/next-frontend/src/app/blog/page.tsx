import { getAllCategoriesList } from '@/lib/requests/categoryRequests';
import CategoryCard from '@/components/CategoryCard/CategoryCard';

import classes from './blog.module.css';

const BlogHubPage = async () => {
  const categories = await getAllCategoriesList();

  return (
    <section className={classes['category_list_section']}>
      <h2>
        <span>explore</span>&nbsp;categories
      </h2>
      <div className={classes['category_cards_container']}>
        {categories.map((category) => {
          return <CategoryCard key={category.id} category={category} />;
        })}
      </div>
    </section>
  );
};

export default BlogHubPage;

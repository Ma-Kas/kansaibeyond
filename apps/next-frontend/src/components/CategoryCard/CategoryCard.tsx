import Link from 'next/link';
import {
  CLOUDINARY_BASE_URL,
  CATEGORY_CARD_IMAGE_TRANSFORM,
} from '@/config/constants';

import { Category } from '@/lib/requests/categoryRequests';

import classes from './CategoryCard.module.css';

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <article key={category.id} className={classes['category_card']}>
      <Link href={`blog/categories/${category.categorySlug}`}>
        <figure className={classes['category_card_image_container']}>
          <img
            className={classes['category_card_image']}
            src={`${CLOUDINARY_BASE_URL}${CATEGORY_CARD_IMAGE_TRANSFORM}${category.coverImage?.urlSlug}`}
            alt=''
          />
        </figure>
        <div className={classes['category_name_container']}>
          <p>{category.categoryName}</p>
        </div>
      </Link>
    </article>
  );
};

export default CategoryCard;

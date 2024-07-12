import Link from 'next/link';
import Image from 'next/image';
import {
  CLOUDINARY_BASE_URL,
  CATEGORY_CARD_IMAGE_TRANSFORM,
} from '@/config/constants';
import { Category } from '@/lib/requests/categoryRequests';
import getBase64ImageUrl from '@/utils/get-bas64-image-url';

import classes from './CategoryCard.module.css';

const CategoryCard = async ({ category }: { category: Category }) => {
  const blurDataUrl = await getBase64ImageUrl(category.coverImage!.urlSlug);

  return (
    <article key={category.id} className={classes['category_card']}>
      <Link
        href={`blog/categories/${category.categorySlug}`}
        aria-label={category.categoryName}
      >
        <figure className={classes['category_card_image_container']}>
          <Image
            className={classes['category_card_image']}
            src={`${CLOUDINARY_BASE_URL}${CATEGORY_CARD_IMAGE_TRANSFORM}${category.coverImage?.urlSlug}`}
            alt=''
            sizes='(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 350px'
            fill
            placeholder='blur'
            blurDataURL={blurDataUrl}
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

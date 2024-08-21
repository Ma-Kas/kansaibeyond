import Link from 'next/link';
import Image from 'next/image';
import {
  WSRV_BASE_URL,
  CLOUDINARY_BASE_URL,
  CATEGORY_CARD_IMAGE_TRANSFORM,
  WSRV_TRANSFORM,
} from '@/config/constants';
import { Category } from '@/types/request-schemas';
import getBase64ImageUrl from '@/utils/get-bas64-image-url';

import classes from './CategoryCard.module.css';

const CategoryCard = async ({ category }: { category: Category }) => {
  const blurDataUrl = await getBase64ImageUrl(category.coverImage!.urlSlug);

  return (
    <article key={category.id} className={classes['category_card']}>
      <Link
        href={`/blog/categories/${category.categorySlug}?page=1`}
        aria-label={category.categoryName}
      >
        <figure className={classes['category_card_image_container']}>
          <Image
            className={classes['category_card_image']}
            src={`${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${CATEGORY_CARD_IMAGE_TRANSFORM}${category.coverImage?.urlSlug}${WSRV_TRANSFORM}`}
            alt=''
            sizes='(max-width: 684px) 90vw, (max-width: 1024px) 40vw, 350px'
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

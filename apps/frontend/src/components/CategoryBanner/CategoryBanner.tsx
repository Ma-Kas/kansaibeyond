import Image from 'next/image';
import {
  WSRV_BASE_URL,
  CLOUDINARY_BASE_URL,
  CATEGORY_BANNER_IMAGE_TRANSFORM,
  WSRV_TRANSFORM,
} from '@/config/constants';
import getBase64ImageUrl from '@/utils/get-bas64-image-url';
import { getOneCategory } from '@/lib/requests/categoryRequests';

import classes from './CategoryBanner.module.css';

const CategoryBanner = async ({ categorySlug }: { categorySlug: string }) => {
  const category = await getOneCategory(categorySlug);

  const blurDataUrl = await getBase64ImageUrl(category.coverImage!.urlSlug);

  return (
    <article className={classes['category_banner']}>
      <Image
        className={classes['category_banner_image']}
        src={`${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${CATEGORY_BANNER_IMAGE_TRANSFORM}${category.coverImage?.urlSlug}${WSRV_TRANSFORM}`}
        alt=''
        sizes='100vw'
        priority={true}
        fill
        placeholder='blur'
        blurDataURL={blurDataUrl}
      />
      <div className={classes['category_banner_content']}>
        <h1>Category</h1>
        <p>{category.categoryName}</p>
      </div>
    </article>
  );
};

export default CategoryBanner;

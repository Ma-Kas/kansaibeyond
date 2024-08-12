import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CLOUDINARY_BASE_URL,
  POST_FEATURED_IMAGE_TRANSFORM,
} from '@/config/constants';
import { getAllPosts } from '@/lib/requests/postRequests';
import getBase64ImageUrl from '@/utils/get-bas64-image-url';
import PostInformation from '../PostInformation/PostInformation';

import classes from './FeaturedPost.module.css';

const FeaturedPost = async ({ queryParam }: { queryParam: string }) => {
  const { rows: post } = await getAllPosts(queryParam);

  const blurDataUrl = post[0].coverImage
    ? await getBase64ImageUrl(post[0].coverImage.urlSlug)
    : '';

  return (
    <article key={post[0].id} className={classes['featured_post']}>
      <figure className={classes['featured_post_image_container']}>
        <Image
          className={classes['featured_post_image']}
          src={`${CLOUDINARY_BASE_URL}${POST_FEATURED_IMAGE_TRANSFORM}${post[0].coverImage?.urlSlug}`}
          alt=''
          sizes='(max-width: 1100px) 100vw, 1100px'
          priority={true}
          fill
          placeholder='blur'
          blurDataURL={blurDataUrl}
        />
        <div className={classes['featured_post_title_category_container']}>
          <h2>{post[0].title}</h2>
          <div className={classes['featured_post_category_link_container']}>
            {post[0].categories.map((category, index, arr) => {
              return (
                <Fragment key={category.id}>
                  <Link
                    href={`/blog/categories/${category.categorySlug}?page=1`}
                    aria-label={`Category: ${category.categoryName}`}
                  >
                    {category.categoryName}
                  </Link>
                  {index + 1 !== arr.length && <span>&#183;</span>}
                </Fragment>
              );
            })}
          </div>
        </div>
      </figure>
      <div className={classes['featured_post_bottom']}>
        <PostInformation user={post[0].user} postDate={post[0].updatedAt} />
        <Link
          className={classes['featured_post_link']}
          href={`blog/posts/${post[0].postSlug}`}
          aria-label={post[0].title}
        >
          VIEW POST
        </Link>
      </div>
    </article>
  );
};

export default FeaturedPost;

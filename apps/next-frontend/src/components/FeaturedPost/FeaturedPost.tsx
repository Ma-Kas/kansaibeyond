import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CLOUDINARY_BASE_URL,
  POST_FEATURED_IMAGE_TRANSFORM,
} from '@/config/constants';
import { PostForList } from '@/lib/requests/postRequests';
import getBase64ImageUrl from '@/utils/get-bas64-image-url';
import PostInformation from '../PostInformation/PostInformation';

import classes from './FeaturedPost.module.css';

const FeaturedPost = async ({ post }: { post: PostForList }) => {
  const blurDataUrl = await getBase64ImageUrl(post.coverImage!.urlSlug);

  return (
    <article key={post.id} className={classes['featured_post']}>
      <figure className={classes['featured_post_image_container']}>
        <Image
          className={classes['featured_post_image']}
          src={`${CLOUDINARY_BASE_URL}${POST_FEATURED_IMAGE_TRANSFORM}${post.coverImage?.urlSlug}`}
          alt=''
          sizes='(max-width: 1024px) 90vw, 1100px'
          priority={true}
          fill
          placeholder='blur'
          blurDataURL={blurDataUrl}
        />
        <div className={classes['featured_post_title_category_container']}>
          <h2>{post.title}</h2>
          <div className={classes['featured_post_category_link_container']}>
            {post.categories.map((category, index, arr) => {
              return (
                <Fragment key={category.id}>
                  <Link
                    href={`/blog/categories/${category.categorySlug}`}
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
        <PostInformation user={post.user} postDate={post.updatedAt} />
        <Link
          className={classes['featured_post_link']}
          href={`blog/posts/${post.postSlug}`}
          aria-label={post.title}
        >
          VIEW POST
        </Link>
      </div>
    </article>
  );
};

export default FeaturedPost;

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { PostUser } from '@/types/request-schemas';
import {
  WSRV_BASE_URL,
  CLOUDINARY_BASE_URL,
  USER_ICON_IMAGE_TRANSFORM,
  WSRV_TRANSFORM,
} from '@/config/constants';
import userIcon from '@public/images/user.svg';
import { formatShortDate } from '@/utils/format-date';

import classes from './PostInformation.module.css';

const PostInformation = ({
  user,
  postDate,
}: {
  user: PostUser;
  postDate: string;
}) => {
  return (
    <div className={classes['post_information_container']}>
      <figure className={classes['author_icon_container']}>
        {user.userIcon && (
          <img
            className={classes['author_icon']}
            src={`${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${USER_ICON_IMAGE_TRANSFORM}${user.userIcon}${WSRV_TRANSFORM}`}
            alt=''
          />
        )}
        {!user.userIcon && (
          <Image
            className={classes['author_icon_placeholder']}
            src={userIcon as StaticImageData}
            alt=''
          />
        )}
      </figure>
      <div className={classes['info_container']}>
        <Link
          href={`/blog/postsby/${user.username}?page=1`}
          aria-label={`Posts by user: ${user.displayName}`}
          title='View posts by user'
        >
          {user.displayName}
        </Link>
        <p>{formatShortDate(postDate)}</p>
      </div>
    </div>
  );
};

export default PostInformation;

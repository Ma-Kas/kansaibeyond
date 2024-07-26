/* eslint-disable @next/next/no-img-element */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
// Necessary due to Next.js typing svg in Image component as "any"

import Image from 'next/image';
import { PostUser } from '@/lib/requests/postRequests';
import {
  CLOUDINARY_BASE_URL,
  USER_ICON_IMAGE_TRANSFORM,
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
            src={`${CLOUDINARY_BASE_URL}${USER_ICON_IMAGE_TRANSFORM}${user.userIcon}`}
            alt=''
          />
        )}
        {!user.userIcon && (
          <Image
            className={classes['author_icon_placeholder']}
            src={userIcon}
            alt=''
          />
        )}
      </figure>
      <div className={classes['info_container']}>
        <p>{user.displayName}</p>
        <p>{formatShortDate(postDate)}</p>
      </div>
    </div>
  );
};

export default PostInformation;

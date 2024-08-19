/* eslint-disable @next/next/no-img-element */

import Image, { type StaticImageData } from 'next/image';
import { PostUser } from '@/lib/requests/postRequests';
import {
  CLOUDINARY_BASE_URL,
  USER_ICON_IMAGE_TRANSFORM,
} from '@/config/constants';
import userIcon from '@public/images/user.svg';
import { formatLongDate } from '@/utils/format-date';

import classes from './UserInformation.module.css';

const UserInformation = ({
  user,
  postDate,
}: {
  user: PostUser;
  postDate: string;
}) => {
  return (
    <section className={classes['user_information_container']}>
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
            src={userIcon as StaticImageData}
            alt=''
          />
        )}
      </figure>
      <div className={classes['info_container']}>
        <p>By {user.displayName}</p>
        <p>Updated {formatLongDate(postDate)}</p>
      </div>
    </section>
  );
};

export default UserInformation;

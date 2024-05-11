import { IconRefresh, IconPlus } from '@tabler/icons-react';
import {
  FEATURED_IMAGE_EDIT_TRANSFORM,
  CLOUDINARY_BASE_URL,
} from '../../config/constants';

import classes from './PostSettingsCoverImage.module.css';

type Props = {
  id: string;
  openMediaLibrary: () => void;
  coverImage?: {
    urlSlug?: string;
    altText?: string;
  };
};

const PostSettingsCoverImage = ({
  id,
  openMediaLibrary,
  coverImage,
}: Props) => {
  if (coverImage && coverImage.urlSlug) {
    return (
      <div className={classes['featured_image_container_edit']}>
        <div className={classes['featured_image_inner_edit']}>
          <img
            id={id}
            src={`${CLOUDINARY_BASE_URL}${FEATURED_IMAGE_EDIT_TRANSFORM}${coverImage.urlSlug}`}
            alt={coverImage.altText}
          />
        </div>
        <div className={classes['featured_image_button_container']}>
          <button type='button' onClick={openMediaLibrary}>
            <IconRefresh />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes['featured_image_container_new']}>
        <div className={classes['featured_image_inner_new']}></div>

        <div className={classes['featured_image_button_container']}>
          <button type='button' onClick={openMediaLibrary}>
            <IconPlus />
          </button>
        </div>
      </div>
    );
  }
};

export default PostSettingsCoverImage;

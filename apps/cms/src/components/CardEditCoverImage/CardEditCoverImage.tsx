import { IconRefresh, IconPlus } from '@tabler/icons-react';
import {
  COVER_IMAGE_EDIT_TRANSFORM,
  CLOUDINARY_BASE_URL,
} from '../../config/constants';

import classes from './CardEditCoverImage.module.css';

type Props = {
  openMediaLibrary: () => void;
  imageUrl?: string;
  altText?: string;
};

const CardEditCoverImage = ({ openMediaLibrary, imageUrl, altText }: Props) => {
  if (imageUrl) {
    return (
      <div className={classes['cover_image_container_edit']}>
        <div className={classes['cover_image_inner_edit']}>
          <img
            src={`${CLOUDINARY_BASE_URL}${COVER_IMAGE_EDIT_TRANSFORM}${imageUrl}`}
            alt={altText}
          />
        </div>
        <div className={classes['cover_image_button_container']}>
          <button type='button' onClick={openMediaLibrary}>
            <IconRefresh />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes['cover_image_container_new']}>
        <div className={classes['cover_image_inner_new']}></div>

        <div className={classes['cover_image_button_container']}>
          <button type='button' onClick={openMediaLibrary}>
            <IconPlus />
          </button>
        </div>
      </div>
    );
  }
};

export default CardEditCoverImage;

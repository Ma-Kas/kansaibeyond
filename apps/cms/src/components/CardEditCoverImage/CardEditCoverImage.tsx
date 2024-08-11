import { IconRefresh, IconPlus } from '@tabler/icons-react';
import {
  COVER_IMAGE_EDIT_TRANSFORM,
  CLOUDINARY_BASE_URL,
  WSRV_BASE_URL,
  WSRV_TRANSFORM,
} from '../../config/constants';

import classes from './CardEditCoverImage.module.css';

type Props = {
  id: string;
  openMediaLibrary: () => void;
  coverImage?: {
    urlSlug?: string;
    altText?: string;
  };
};

const CardEditCoverImage = ({ id, openMediaLibrary, coverImage }: Props) => {
  if (coverImage && coverImage.urlSlug) {
    return (
      <div className={classes['cover_image_container_edit']}>
        <div className={classes['cover_image_inner_edit']}>
          <img
            id={id}
            src={`${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${COVER_IMAGE_EDIT_TRANSFORM}${coverImage.urlSlug}${WSRV_TRANSFORM}`}
            alt={coverImage.altText}
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
        <div id={id} className={classes['cover_image_inner_new']}></div>

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

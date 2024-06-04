import { IconRefresh, IconPlus } from '@tabler/icons-react';
import {
  USER_ICON_EDIT_TRANSFORM,
  CLOUDINARY_BASE_URL,
} from '../../config/constants';

import classes from './CardEditUserIcon.module.css';

type Props = {
  id: string;
  openMediaLibrary: () => void;
  userIcon?: string;
};

const CardEditUserIcon = ({ id, openMediaLibrary, userIcon }: Props) => {
  if (userIcon) {
    return (
      <div className={classes['user_icon_container_edit']}>
        <div className={classes['user_icon_inner_edit']}>
          <img
            id={id}
            src={`${CLOUDINARY_BASE_URL}${USER_ICON_EDIT_TRANSFORM}${userIcon}`}
          />
        </div>
        <div className={classes['user_icon_button_container']}>
          <button type='button' onClick={openMediaLibrary}>
            <IconRefresh />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes['user_icon_container_new']}>
        <div id={id} className={classes['user_icon_inner_new']}></div>

        <div className={classes['user_icon_button_container']}>
          <button type='button' onClick={openMediaLibrary}>
            <IconPlus />
          </button>
        </div>
      </div>
    );
  }
};

export default CardEditUserIcon;

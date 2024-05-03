import cx from 'clsx';
import { useState } from 'react';
import { Checkbox, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../requests/postRequests';
import { formatShortDate } from '../../utils/format-date';
import {
  CLOUDINARY_BASE_URL,
  POST_LIST_THUMB_TRANSFORM,
} from '../../config/constants';

import classes from './CardTablePosts.module.css';

type TableProps = {
  headerTopStyle: string;
  blogTableData: Post[];
};

const CardTablePosts = ({ headerTopStyle, blogTableData }: TableProps) => {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<number[]>([]);

  const toggleRow = (id: number) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === blogTableData.length
        ? []
        : blogTableData.map((item) => item.id)
    );

  const blogRows = blogTableData.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr
        key={item.id}
        className={cx(classes['card_body_table_row'], {
          [classes.rowSelected]: selected,
        })}
      >
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
          />
        </td>
        <td>
          <div className={classes['card_body_table_row_image_container']}>
            <img
              src={`${CLOUDINARY_BASE_URL}${POST_LIST_THUMB_TRANSFORM}${item.coverImage?.urlSlug}`}
              alt={item.coverImage?.altText}
            />
          </div>
        </td>
        <td>
          <div className={classes['card_body_table_row_post_container']}>
            <div>{item.title}</div>
            <div>
              {item.categories
                .map((category) => category.categoryName)
                .join(' · ')}
            </div>
            <div>{`${formatShortDate(item.updatedAt)} · ${
              item.user.displayName
            }`}</div>
          </div>
        </td>
        <td>
          <div className={classes['card_body_table_row_button_group']}>
            <Button radius={'xl'} onClick={() => navigate('/composer')}>
              Edit
            </Button>
            <button>
              <span>...</span>
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <table className={classes['card_inner']}>
      <thead style={{ top: headerTopStyle }} className={classes['card_header']}>
        <tr className={classes['card_header_table_row']}>
          <th>
            <Checkbox
              onChange={toggleAll}
              checked={
                selection.length === blogTableData.length &&
                selection.length !== 0
              }
              indeterminate={
                selection.length > 0 &&
                selection.length !== blogTableData.length
              }
            />
          </th>
          <th>
            {selection.length === 0
              ? 'Select all'
              : `${selection.length} Selected`}
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody className={classes['card_body']}>{blogRows}</tbody>
    </table>
  );
};

export default CardTablePosts;

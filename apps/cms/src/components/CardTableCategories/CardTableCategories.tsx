import cx from 'clsx';
import { useState } from 'react';
import { Checkbox, Button } from '@mantine/core';

import { useNavigate } from 'react-router-dom';
import classes from './CardTableCategories.module.css';

export type CategoryTableData = {
  id: number;
  image: string;
  name: string;
  urlSlug: string;
  posts: number;
};

type TableProps = {
  headerTopStyle: string;
  categoryTableData: CategoryTableData[];
};

const CardTableCategories = ({
  headerTopStyle,
  categoryTableData,
}: TableProps) => {
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
      current.length === categoryTableData.length
        ? []
        : categoryTableData.map((item) => item.id)
    );

  const categoryRows = categoryTableData.map((item) => {
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
            <img src={item.image} />
          </div>
        </td>
        <td>{item.name}</td>
        <td>{`/${item.urlSlug}`}</td>
        <td>{`${item.posts} ${item.posts === 1 ? 'post' : 'posts'}`}</td>
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
              checked={selection.length === categoryTableData.length}
              indeterminate={
                selection.length > 0 &&
                selection.length !== categoryTableData.length
              }
            />
          </th>
          <th>
            {selection.length === 0
              ? 'Select all'
              : `${selection.length} Selected`}
          </th>
          <th>Category Name</th>
          <th>URL Slug</th>
          <th>Posts</th>
          <th></th>
        </tr>
      </thead>
      <tbody className={classes['card_body']}>{categoryRows}</tbody>
    </table>
  );
};

export default CardTableCategories;

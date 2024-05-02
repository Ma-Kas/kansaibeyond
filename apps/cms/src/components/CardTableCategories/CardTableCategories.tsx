import cx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox, Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { ConfirmDeleteModal } from '../FeedbackModals/FeedbackModals';
import {
  SuccessNotification,
  ErrorNotification,
} from '../FeedbackPopups/FeedbackPopups';
import FurtherEditDropdown from '../FurtherEditDropdown/FurtherEditDropdown';
import { deleteCategory } from '../../requests/categoryRequests';
import {
  CLOUDINARY_BASE_URL,
  CATEGORY_LIST_THUMB_TRANSFORM,
} from '../../config/constants';

import classes from './CardTableCategories.module.css';

export type CategoryTableData = {
  id: number;
  categoryName: string;
  categorySlug: string;
  description: string | null;
  coverImage: { altText: string; urlSlug: string } | null;
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

  const queryClient = useQueryClient();

  const categoryDeleteMutation = useMutation({
    mutationFn: (urlSlug: string) => deleteCategory(urlSlug),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      notifications.show(SuccessNotification({ bodyText: data?.message }));
    },
    onError: (err) => {
      notifications.show(ErrorNotification({ bodyText: err.message }));
    },
  });

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
    const furtherEditDropdownItems = [
      {
        text: 'Edit Category',
        icon: IconEdit,
        onClick: () => navigate(`${item.categorySlug}/edit`),
      },
      {
        text: 'Delete Category',
        icon: IconTrash,
        onClick: () =>
          modals.openConfirmModal(
            ConfirmDeleteModal({
              titleText: `Delete category "${item.categoryName}?`,
              bodyText: `Are you sure you want to delete category "${item.categoryName}? This action cannot be undone.`,
              onConfirm: () => categoryDeleteMutation.mutate(item.categorySlug),
            })
          ),
      },
    ];

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
              src={`${CLOUDINARY_BASE_URL}${CATEGORY_LIST_THUMB_TRANSFORM}${item.coverImage?.urlSlug}`}
              alt={item.coverImage?.altText}
            />
          </div>
        </td>
        <td>{item.categoryName}</td>
        <td>{`/${item.categorySlug}`}</td>
        <td>{`${item.posts} ${item.posts === 1 ? 'post' : 'posts'}`}</td>
        <td>
          <div className={classes['card_body_table_row_button_group']}>
            <Button
              radius={'xl'}
              onClick={() => navigate(`${item.categorySlug}/edit`)}
            >
              Edit
            </Button>
            <FurtherEditDropdown items={furtherEditDropdownItems} />
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
          <th style={{ textAlign: 'center' }}>
            {selection.length === 0 ? 'Select all' : `${selection.length}`}
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

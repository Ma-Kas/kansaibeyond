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
import { deleteTag } from '../../requests/tagRequests';
import useAuth from '../../hooks/useAuth';
import {
  hasAdminPermission,
  hasWriterPermission,
} from '../../utils/permission-group-handler';

import classes from './CardTableTags.module.css';

export type TagTableData = {
  id: number;
  tagName: string;
  tagSlug: string;
  posts: number;
};

type TableProps = {
  headerTopStyle: string;
  tagTableData: TagTableData[];
};

const CardTableTags = ({ headerTopStyle, tagTableData }: TableProps) => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [selection, setSelection] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const tagDeleteMutation = useMutation({
    mutationFn: (urlSlug: string) => deleteTag(urlSlug),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['tags'] });
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
      current.length === tagTableData.length
        ? []
        : tagTableData.map((item) => item.id)
    );

  const tagRows = tagTableData.map((item) => {
    const selected = selection.includes(item.id);

    const furtherEditDropdownItems = [
      {
        text: 'Edit Tag',
        icon: IconEdit,
        onClick: () => navigate(`${item.tagSlug}/edit`),
      },
    ];
    const furtherEditDropdownAdminItems = [
      {
        text: 'Edit Tag',
        icon: IconEdit,
        onClick: () => navigate(`${item.tagSlug}/edit`),
      },
      {
        text: 'Delete tag',
        icon: IconTrash,
        onClick: () =>
          modals.openConfirmModal(
            ConfirmDeleteModal({
              titleText: `Delete tag "${item.tagName}?`,
              bodyText: `Are you sure you want to delete tag "${item.tagName}? This action cannot be undone.`,
              onConfirm: () => tagDeleteMutation.mutate(item.tagSlug),
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
        <td>{item.tagName}</td>
        <td>{`/${item.tagSlug}`}</td>
        <td>{`${item.posts} ${item.posts === 1 ? 'post' : 'posts'}`}</td>
        {user && hasWriterPermission(user.role) && (
          <td>
            <div className={classes['card_body_table_row_button_group']}>
              <Button
                type='button'
                radius={'xl'}
                onClick={() => navigate(`${item.tagSlug}/edit`)}
              >
                Edit
              </Button>
              <FurtherEditDropdown
                items={
                  hasAdminPermission(user.role)
                    ? furtherEditDropdownAdminItems
                    : furtherEditDropdownItems
                }
              />
            </div>
          </td>
        )}
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
              checked={selection.length === tagTableData.length}
              indeterminate={
                selection.length > 0 && selection.length !== tagTableData.length
              }
            />
          </th>
          <th>Tag Name</th>
          <th>URL Slug</th>
          <th>Posts</th>
          {user && hasWriterPermission(user.role) && <th></th>}
        </tr>
      </thead>
      <tbody className={classes['card_body']}>{tagRows}</tbody>
    </table>
  );
};

export default CardTableTags;

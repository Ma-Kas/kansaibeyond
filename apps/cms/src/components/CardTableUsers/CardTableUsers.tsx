import cx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox, Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconTrash,
  IconEdit,
  IconUserCircle,
  IconRefresh,
} from '@tabler/icons-react';
import {
  ConfirmDeleteModal,
  ConfirmToggleDisableModal,
} from '../FeedbackModals/FeedbackModals';
import {
  SuccessNotification,
  ErrorNotification,
} from '../FeedbackPopups/FeedbackPopups';
import FurtherEditDropdown from '../FurtherEditDropdown/FurtherEditDropdown';

import { deleteUser, updateUser, User } from '../../requests/userRequests';
import {
  CLOUDINARY_BASE_URL,
  USER_LIST_THUMB_TRANSFORM,
} from '../../config/constants';

import classes from './CardTableUsers.module.css';

type UserTableData = Omit<User, 'posts'> & { posts: number };

type TableProps = {
  headerTopStyle: string;
  userTableData: UserTableData[];
};

const CardTableUsers = ({ headerTopStyle, userTableData }: TableProps) => {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<number[]>([]);

  const queryClient = useQueryClient();

  // Simple update mutation to change disabled or role
  const userUpdateMutation = useMutation({
    mutationFn: ({ username, values }: { username: string; values: unknown }) =>
      updateUser(username, values),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['users'] }),
      ]);

      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `User updated: ${data.displayName}`,
          })
        );
      }
    },
    onError: (err) => {
      notifications.show(ErrorNotification({ bodyText: err.message }));
    },
  });

  const userDeleteMutation = useMutation({
    mutationFn: (username: string) => deleteUser(username),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
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
      current.length === userTableData.length
        ? []
        : userTableData.map((item) => item.id)
    );

  const userRows = userTableData.map((item) => {
    const selected = selection.includes(item.id);

    const furtherEditDropdownItems = [
      {
        text: 'Edit User',
        icon: IconEdit,
        onClick: () => navigate(`${item.username}/edit`),
      },
      ...(item.disabled
        ? [
            {
              text: 'Enable User',
              icon: IconRefresh,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmToggleDisableModal({
                    titleText: `Enable user account?`,
                    bodyText: `Are you sure you want to enable user "${item.displayName}"? `,
                    disable: false,
                    onConfirm: () =>
                      userUpdateMutation.mutate({
                        username: item.username,
                        values: { disabled: false },
                      }),
                  })
                ),
            },
          ]
        : [
            {
              text: 'Disable User',
              icon: IconRefresh,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmToggleDisableModal({
                    titleText: `Disable user account?`,
                    bodyText: `Are you sure you want to disable user "${item.displayName}"? `,
                    disable: true,
                    onConfirm: () =>
                      userUpdateMutation.mutate({
                        username: item.username,
                        values: { disabled: true },
                      }),
                  })
                ),
            },
          ]),
      {
        text: 'Delete User',
        icon: IconTrash,
        onClick: () =>
          modals.openConfirmModal(
            ConfirmDeleteModal({
              titleText: `Delete user "${item.displayName}?`,
              bodyText: `Are you sure you want to delete user "${item.displayName}? This action cannot be undone.`,
              onConfirm: () => userDeleteMutation.mutate(item.username),
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
          {item.userIcon && (
            <div className={classes['card_body_table_row_image_container']}>
              <img
                src={`${CLOUDINARY_BASE_URL}${USER_LIST_THUMB_TRANSFORM}${item.userIcon}`}
                alt={`Image icon for user ${item.username}`}
              />
            </div>
          )}
          {item.userIcon === null && (
            <div
              className={
                classes['card_body_table_row_image_placeholder_container']
              }
            >
              <div className={classes['card_body_table_row_image_placeholder']}>
                <IconUserCircle style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          )}
        </td>
        <td>{item.displayName}</td>
        <td>{`${item.posts} ${item.posts === 1 ? 'post' : 'posts'}`}</td>
        <td>{item.role}</td>
        <td className={item.disabled ? classes.disabled : undefined}>
          {item.disabled ? 'DISABLED' : ''}
        </td>

        <td>
          <div className={classes['card_body_table_row_button_group']}>
            <Button
              type='button'
              radius={'xl'}
              onClick={() => navigate(`${item.username}/edit`)}
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
              checked={selection.length === userTableData.length}
              indeterminate={
                selection.length > 0 &&
                selection.length !== userTableData.length
              }
            />
          </th>
          <th style={{ textAlign: 'center' }}>
            {selection.length === 0 ? 'Select all' : `${selection.length}`}
          </th>
          <th>Display Name</th>
          <th>Posts</th>
          <th>Role</th>
          <th>Disabled</th>
          <th></th>
        </tr>
      </thead>
      <tbody className={classes['card_body']}>{userRows}</tbody>
    </table>
  );
};

export default CardTableUsers;

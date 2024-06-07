import cx from 'clsx';
import { useState } from 'react';
import { Checkbox, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Post,
  deletePost,
  trashPost,
  updatePost,
} from '../../requests/postRequests';
import { formatShortDate } from '../../utils/format-date';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconTrash,
  IconTrashX,
  IconEdit,
  IconRefresh,
  IconSend,
  IconPhoto,
} from '@tabler/icons-react';
import {
  ConfirmDeleteModal,
  ConfirmTrashModal,
  GeneralConfirmModal,
} from '../FeedbackModals/FeedbackModals';
import {
  SuccessNotification,
  ErrorNotification,
} from '../FeedbackPopups/FeedbackPopups';
import FurtherEditDropdown from '../FurtherEditDropdown/FurtherEditDropdown';
import {
  CLOUDINARY_BASE_URL,
  POST_LIST_THUMB_TRANSFORM,
} from '../../config/constants';
import useAuth from '../../hooks/useAuth';
import {
  hasAdminPermission,
  hasOwnerPermission,
  hasWriterPermission,
} from '../../utils/permission-group-handler';

import classes from './CardTablePosts.module.css';

type TableProps = {
  headerTopStyle: string;
  tab: string;
  blogTableData: Post[];
};

const CardTablePosts = ({ headerTopStyle, tab, blogTableData }: TableProps) => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [selection, setSelection] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const postDeleteMutation = useMutation({
    mutationFn: (urlSlug: string) => deletePost(urlSlug),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      notifications.show(SuccessNotification({ bodyText: data?.message }));
    },
    onError: (err) => {
      notifications.show(ErrorNotification({ bodyText: err.message }));
    },
  });

  // Simple update mutation to change status
  const postUpdateMutation = useMutation({
    mutationFn: ({ urlSlug, values }: { urlSlug: string; values: unknown }) =>
      updatePost(urlSlug, values),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
      ]);

      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `Post updated: ${data.title}`,
          })
        );
      }
    },
    onError: (err) => {
      notifications.show(ErrorNotification({ bodyText: err.message }));
    },
  });

  const postTrashMutation = useMutation({
    mutationFn: (urlSlug: string) => trashPost(urlSlug),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
      ]);

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
      current.length === blogTableData.length
        ? []
        : blogTableData.map((item) => item.id)
    );

  const blogRows = blogTableData.map((item) => {
    const selected = selection.includes(item.id);

    // Tab-dependent context actions for selected post
    const switchfurtherEditDropDownItemsOnTab = () => {
      switch (tab) {
        case 'published': {
          return [
            {
              text: 'Edit Post',
              icon: IconEdit,
              onClick: () => navigate(`/composer/edit/${item.postSlug}`),
            },
            {
              text: 'Revert to Draft',
              icon: IconRefresh,
              onClick: () =>
                modals.openConfirmModal(
                  GeneralConfirmModal({
                    titleText: `Revert post back to draft?`,
                    bodyText: `Are you sure you want to revert the post "${item.title}" back to draft? This will make it no longer publically viewable`,
                    onConfirm: () =>
                      postUpdateMutation.mutate({
                        urlSlug: item.postSlug,
                        values: { status: 'draft' },
                      }),
                  })
                ),
            },
            {
              text: 'Move to Trash',
              icon: IconTrash,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmTrashModal({
                    titleText: `Trash post "${item.title}?`,
                    bodyText: `Are you sure you want to move post "${item.title}" to trash?`,
                    onConfirm: () => postTrashMutation.mutate(item.postSlug),
                  })
                ),
            },
          ];
        }
        case 'draft': {
          return [
            {
              text: 'Edit Post',
              icon: IconEdit,
              onClick: () => navigate(`/composer/edit/${item.postSlug}`),
            },
            ...(user && hasAdminPermission(user.role)
              ? [
                  {
                    text: 'Publish Post',
                    icon: IconSend,
                    onClick: () =>
                      modals.openConfirmModal(
                        GeneralConfirmModal({
                          titleText: `Publish post "${item.title}?`,
                          bodyText: `You are about to publish post "${item.title}" to the website. Proceed?`,
                          onConfirm: () =>
                            postUpdateMutation.mutate({
                              urlSlug: item.postSlug,
                              values: { status: 'published' },
                            }),
                        })
                      ),
                  },
                ]
              : []),
            ...(user && !hasAdminPermission(user.role)
              ? [
                  {
                    text: 'Request to Publish',
                    icon: IconSend,
                    onClick: () =>
                      modals.openConfirmModal(
                        GeneralConfirmModal({
                          titleText: `Submit post for review?`,
                          bodyText: `You are about to submit post "${item.title}" for a review by an admin. If approved, it will be published to the website. Proceed?`,
                          onConfirm: () =>
                            postUpdateMutation.mutate({
                              urlSlug: item.postSlug,
                              values: { status: 'pending' },
                            }),
                        })
                      ),
                  },
                ]
              : []),
            {
              text: 'Move to Trash',
              icon: IconTrash,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmTrashModal({
                    titleText: `Trash post "${item.title}?`,
                    bodyText: `Are you sure you want to move post "${item.title}" to trash?`,
                    onConfirm: () => postTrashMutation.mutate(item.postSlug),
                  })
                ),
            },
          ];
        }
        case 'pending': {
          return [
            {
              text: 'Edit Post',
              icon: IconEdit,
              onClick: () => navigate(`/composer/edit/${item.postSlug}`),
            },
            ...(user && hasAdminPermission(user.role)
              ? [
                  {
                    text: 'Publish Post',
                    icon: IconSend,
                    onClick: () =>
                      modals.openConfirmModal(
                        GeneralConfirmModal({
                          titleText: `Publish post "${item.title}?`,
                          bodyText: `You are about to publish post "${item.title}" to the website. Proceed?`,
                          onConfirm: () =>
                            postUpdateMutation.mutate({
                              urlSlug: item.postSlug,
                              values: { status: 'published' },
                            }),
                        })
                      ),
                  },
                ]
              : []),
            ...(user && !hasAdminPermission(user.role)
              ? [
                  {
                    text: 'Revert to Draft',
                    icon: IconRefresh,
                    onClick: () =>
                      modals.openConfirmModal(
                        GeneralConfirmModal({
                          titleText: `Revert post back to draft?`,
                          bodyText: `Are you sure you want to revert the post "${item.title}" back to draft?`,
                          onConfirm: () =>
                            postUpdateMutation.mutate({
                              urlSlug: item.postSlug,
                              values: { status: 'draft' },
                            }),
                        })
                      ),
                  },
                ]
              : []),

            {
              text: 'Move to Trash',
              icon: IconTrash,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmTrashModal({
                    titleText: `Trash post "${item.title}?`,
                    bodyText: `Are you sure you want to move post "${item.title}" to trash?`,
                    onConfirm: () => postTrashMutation.mutate(item.postSlug),
                  })
                ),
            },
          ];
        }
        default: {
          return [
            {
              text: 'Edit Post',
              icon: IconEdit,
              onClick: () => navigate(`/composer/edit/${item.postSlug}`),
            },
            {
              text: 'Revert to Draft',
              icon: IconRefresh,
              onClick: () =>
                modals.openConfirmModal(
                  GeneralConfirmModal({
                    titleText: `Revert post back to draft?`,
                    bodyText: `Are you sure you want to revert the post "${item.title}" back to draft?`,
                    onConfirm: () =>
                      postUpdateMutation.mutate({
                        urlSlug: item.postSlug,
                        values: { status: 'draft' },
                      }),
                  })
                ),
            },
            {
              text: 'Delete Post',
              icon: IconTrashX,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmDeleteModal({
                    titleText: `Delete post "${item.title}?`,
                    bodyText: `Are you sure you want to delete post "${item.title}"? This action cannot be undone.`,
                    onConfirm: () => postDeleteMutation.mutate(item.postSlug),
                  })
                ),
            },
          ];
        }
      }
    };

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
          {item.coverImage && (
            <div className={classes['card_body_table_row_image_container']}>
              <img
                src={`${CLOUDINARY_BASE_URL}${POST_LIST_THUMB_TRANSFORM}${item.coverImage?.urlSlug}`}
                alt={item.coverImage?.altText}
              />
            </div>
          )}
          {item.coverImage === null && (
            <div
              className={
                classes['card_body_table_row_image_placeholder_container']
              }
            >
              <div className={classes['card_body_table_row_image_placeholder']}>
                <IconPhoto style={{ width: '50%', height: '50%' }} />
              </div>
            </div>
          )}
        </td>
        <td>
          <div className={classes['card_body_table_row_post_container']}>
            <div>{item.title}</div>
            <div>
              {item.categories
                .map((category) => category.categoryName)
                .join(' \u{00B7} ')}
            </div>
            <div>{`${formatShortDate(item.updatedAt)} \u{00B7} ${
              item.user.displayName
            }`}</div>
          </div>
        </td>
        <td>
          {user &&
            (hasOwnerPermission(user.role) ||
              (hasAdminPermission(user.role) &&
                !hasOwnerPermission(item.user.role)) ||
              (hasWriterPermission(user.role) && user.id === item.userId)) && (
              <div className={classes['card_body_table_row_button_group']}>
                <Button
                  type='button'
                  radius={'xl'}
                  onClick={() => navigate(`/composer/edit/${item.postSlug}`)}
                >
                  Edit
                </Button>
                <FurtherEditDropdown
                  items={switchfurtherEditDropDownItemsOnTab()}
                />
              </div>
            )}
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

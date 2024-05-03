import cx from 'clsx';
import { useState } from 'react';
import { Checkbox, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post, deletePost, updatePost } from '../../requests/postRequests';
import { formatShortDate } from '../../utils/format-date';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconTrash,
  IconEdit,
  IconRefresh,
  IconSend,
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

import classes from './CardTablePosts.module.css';

type TableProps = {
  headerTopStyle: string;
  tab: string;
  blogTableData: Post[];
};

const CardTablePosts = ({ headerTopStyle, tab, blogTableData }: TableProps) => {
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

    const switchfurtherEditDropDownItemsOnTab = () => {
      switch (tab) {
        case 'published': {
          return [
            {
              text: 'Edit Post',
              icon: IconEdit,
              onClick: () => navigate(`${item.postSlug}/edit`),
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
                    onConfirm: () =>
                      postUpdateMutation.mutate({
                        urlSlug: item.postSlug,
                        values: { status: 'trash' },
                      }),
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
              onClick: () => navigate(`${item.postSlug}/edit`),
            },
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
            {
              text: 'Move to Trash',
              icon: IconTrash,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmTrashModal({
                    titleText: `Trash post "${item.title}?`,
                    bodyText: `Are you sure you want to move post "${item.title}" to trash?`,
                    onConfirm: () =>
                      postUpdateMutation.mutate({
                        urlSlug: item.postSlug,
                        values: { status: 'trash' },
                      }),
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
              onClick: () => navigate(`${item.postSlug}/edit`),
            },
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
            {
              text: 'Move to Trash',
              icon: IconTrash,
              onClick: () =>
                modals.openConfirmModal(
                  ConfirmTrashModal({
                    titleText: `Trash post "${item.title}?`,
                    bodyText: `Are you sure you want to move post "${item.title}" to trash?`,
                    onConfirm: () =>
                      postUpdateMutation.mutate({
                        urlSlug: item.postSlug,
                        values: { status: 'trash' },
                      }),
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
              onClick: () => navigate(`${item.postSlug}/edit`),
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
              icon: IconTrash,
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
                .join(' \u{00B7} ')}
            </div>
            <div>{`${formatShortDate(item.updatedAt)} \u{00B7} ${
              item.user.displayName
            }`}</div>
          </div>
        </td>
        <td>
          <div className={classes['card_body_table_row_button_group']}>
            <Button radius={'xl'} onClick={() => navigate('/composer')}>
              Edit
            </Button>
            <FurtherEditDropdown
              items={switchfurtherEditDropDownItemsOnTab()}
            />
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

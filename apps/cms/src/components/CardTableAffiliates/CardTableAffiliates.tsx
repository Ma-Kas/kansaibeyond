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
import { Affiliate, deleteAffiliate } from '../../requests/affiliateRequests';
import { postRevalidation } from '../../requests/revalidateTagRequests';
import { REVALIDATION_TAGS } from '../../config/constants';

import classes from './CardTableAffiliates.module.css';

type TableProps = {
  headerTopStyle: string;
  affiliatesTableData: Affiliate[];
};

const CardTableAffiliates = ({
  headerTopStyle,
  affiliatesTableData,
}: TableProps) => {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const affiliateDeleteMutation = useMutation({
    mutationFn: (id: number) => deleteAffiliate(id),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['affiliates'] }),
        postRevalidation(REVALIDATION_TAGS.affiliates),
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
      current.length === affiliatesTableData.length
        ? []
        : affiliatesTableData.map((item) => item.id)
    );

  const affiliateRows = affiliatesTableData.map((item) => {
    const selected = selection.includes(item.id);
    const furtherEditDropdownItems = [
      {
        text: 'Edit Affiliate',
        icon: IconEdit,
        onClick: () => navigate(`${item.id}/edit`),
      },
      {
        text: 'Delete Affiliate',
        icon: IconTrash,
        onClick: () =>
          modals.openConfirmModal(
            ConfirmDeleteModal({
              titleText: `Delete affiliate "${item.blogName}?`,
              bodyText: `Are you sure you want to delete affiliate blog "${item.blogName}? This action cannot be undone.`,
              onConfirm: () => affiliateDeleteMutation.mutate(item.id),
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
        <td>{item.blogName}</td>
        <td>{`${item.blogUrl}`}</td>
        <td>{item.userId ? item.user?.displayName : '-'}</td>
        <td>
          <div className={classes['card_body_table_row_button_group']}>
            <Button
              type='button'
              radius={'xl'}
              onClick={() => navigate(`${item.id}/edit`)}
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
              checked={selection.length === affiliatesTableData.length}
              indeterminate={
                selection.length > 0 &&
                selection.length !== affiliatesTableData.length
              }
            />
          </th>
          <th>Blog Name</th>
          <th>Blog URL</th>
          <th>Associated User</th>
          <th></th>
        </tr>
      </thead>
      <tbody className={classes['card_body']}>{affiliateRows}</tbody>
    </table>
  );
};

export default CardTableAffiliates;

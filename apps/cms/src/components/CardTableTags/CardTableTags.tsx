import cx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox, Button } from '@mantine/core';

import { deleteTag } from '../../requests/tagRequests';

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
  const navigate = useNavigate();
  const [selection, setSelection] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const tagDeleteMutation = useMutation({
    mutationFn: (urlSlug: string) => deleteTag(urlSlug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (err) => {
      alert(err.message);
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
        <td>
          <div className={classes['card_body_table_row_button_group']}>
            <Button
              radius={'xl'}
              onClick={() =>
                navigate(`${item.tagSlug}/edit`, {
                  state: {
                    type: 'update',
                    tagName: item.tagName,
                    tagSlug: item.tagSlug,
                  },
                })
              }
            >
              Edit
            </Button>
            <button onClick={() => tagDeleteMutation.mutate(item.tagSlug)}>
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
              checked={selection.length === tagTableData.length}
              indeterminate={
                selection.length > 0 && selection.length !== tagTableData.length
              }
            />
          </th>
          <th>Tag Name</th>
          <th>URL Slug</th>
          <th>Posts</th>
          <th></th>
        </tr>
      </thead>
      <tbody className={classes['card_body']}>{tagRows}</tbody>
    </table>
  );
};

export default CardTableTags;

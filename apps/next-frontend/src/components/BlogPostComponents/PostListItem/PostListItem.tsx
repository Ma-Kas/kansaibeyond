import type * as CSS from 'csstype';
import { INDENTATION_FACTOR } from '@/utils/post-content-constants';
import { ListItemNode } from '@/types/post-content-types';

import classes from './PostListItem.module.css';

type Props = {
  format: string;
  indent: number;
  listItemNode: ListItemNode;
  children?: React.ReactNode;
};

const PostListItem = ({ format, indent, listItemNode, children }: Props) => {
  const style: CSS.Properties = {};
  if (format && format !== '') {
    style.textAlign = format as CSS.Property.TextAlign;
  }
  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  // Replace empty item from editor with <br>
  if (!listItemNode.children.length) {
    return <br></br>;
  }

  return (
    <li
      className={classes['post_list_item']}
      {...(style && { style: style })}
      value={listItemNode.value}
    >
      {children}
    </li>
  );
};

export default PostListItem;

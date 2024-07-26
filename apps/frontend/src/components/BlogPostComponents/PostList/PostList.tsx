import type * as CSS from 'csstype';
import { Property } from 'csstype';
import { INDENTATION_FACTOR } from '@/utils/post-content-constants';
import { ListNode } from '@/types/post-content-types';

import classes from './PostList.module.css';

type Props = {
  format: string;
  indent: number;
  listNode: ListNode;
  children?: React.ReactNode;
};

const PostList = ({
  format,
  indent,
  listNode,
  children,
}: Props): JSX.Element => {
  const style: CSS.Properties = {};
  if (format && format !== '') {
    style.textAlign = format as Property.TextAlign;
  }
  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  // Replace empty list from editor with <br>
  if (!listNode.children.length) {
    return <br></br>;
  }

  if (listNode.tag === 'ol') {
    return (
      <ol
        className={classes[`post_list_${listNode.listType}`]}
        {...(style && { style: style })}
        start={listNode.start}
      >
        {children}
      </ol>
    );
  } else {
    return (
      <ul
        className={classes[`post_list_${listNode.listType}`]}
        {...(style && { style: style })}
      >
        {children}
      </ul>
    );
  }
};

export default PostList;

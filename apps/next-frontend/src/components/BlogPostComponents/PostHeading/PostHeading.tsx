import { createElement } from 'react';
import type * as CSS from 'csstype';
import { INDENTATION_FACTOR } from '@/utils/post-content-constants';
import { HeadingNode } from '@/types/post-content-types';

import classes from './PostHeading.module.css';

type Props = {
  format: string;
  indent: number;
  headingNode: HeadingNode;
  children?: React.ReactNode;
};

const PostHeading = ({ format, indent, headingNode, children }: Props) => {
  const style: CSS.Properties = {};
  if (format && format !== '') {
    style.textAlign = format as CSS.Property.TextAlign;
  }
  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  // Replace empty heading from editor with <br>
  if (!headingNode.children.length) {
    return <br></br>;
  }

  // createElement syntax over JSX to utilize variable for appropriate tag creation
  // instead of code repeat in switch statement
  return createElement(
    headingNode.tag,
    {
      key: crypto.randomUUID(),
      style: { ...(style ? { style: style } : { color: 'red' }) },
      className: classes[`post_heading_${headingNode.tag.slice(-1)}`],
    },
    children
  );
};

export default PostHeading;

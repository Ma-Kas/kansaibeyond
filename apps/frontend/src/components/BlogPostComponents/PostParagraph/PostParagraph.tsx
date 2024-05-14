import type * as CSS from 'csstype';
import { Property } from 'csstype';
import { INDENTATION_FACTOR } from '../../../pages/BlogPostView/utils/post-content-constants';

import classes from './PostParagraph.module.css';

type Props = {
  format: string;
  indent: number;
  children?: React.ReactNode;
};

const PostParagraph = ({ format, indent, children }: Props) => {
  const style: CSS.Properties = {};

  if (format && format !== '') {
    style.textAlign = format as Property.TextAlign;
  }

  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  return (
    <p className={classes['post_paragraph']} {...(style && { style: style })}>
      {children}
    </p>
  );
};

export default PostParagraph;

import type * as CSS from 'csstype';
import { Property } from 'csstype';
import { INDENTATION_FACTOR } from '../../../pages/BlogPostView/utils/post-content-constants';
import { QuoteNode } from '../../../types/post-content-types';

import classes from './PostQuote.module.css';

type Props = {
  format: string;
  indent: number;
  quoteNode: QuoteNode;
  children?: React.ReactNode;
};

const PostQuote = ({ format, indent, quoteNode, children }: Props) => {
  const style: CSS.Properties = {};
  if (format && format !== '') {
    style.textAlign = format as Property.TextAlign;
  }
  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  // Replace empty quote from editor with <br>
  if (!quoteNode.children.length) {
    return <br></br>;
  }

  return (
    <blockquote
      className={classes['post_quote']}
      {...(style && { style: style })}
    >
      {children}
    </blockquote>
  );
};

export default PostQuote;

import type * as CSS from 'csstype';
import { Property } from 'csstype';
import { INDENTATION_FACTOR } from '../../../pages/BlogPostView/utils/post-content-constants';
import { ParagraphNode } from '../../../types/post-content-types';

import classes from './PostParagraph.module.css';

type Props = {
  format: string;
  indent: number;
  paragraphNode: ParagraphNode;
  children?: React.ReactNode;
};

const PostParagraph = ({ format, indent, paragraphNode, children }: Props) => {
  const style: CSS.Properties = {};

  if (format && format !== '') {
    style.textAlign = format as Property.TextAlign;
  }

  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  // Replace empty paragraph from editor with <br>
  if (!paragraphNode.children.length) {
    return <br></br>;
  }

  return (
    <p className={classes['post_paragraph']} {...(style && { style: style })}>
      {children}
    </p>
  );
};

export default PostParagraph;

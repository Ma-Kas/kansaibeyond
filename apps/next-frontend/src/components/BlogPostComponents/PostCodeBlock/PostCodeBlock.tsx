import type * as CSS from 'csstype';
import { Property } from 'csstype';
import { INDENTATION_FACTOR } from '@/utils/post-content-constants';
import { CodeBlockNode } from '@/types/post-content-types';

import classes from './PostCodeBlock.module.css';

type Props = {
  format: string;
  indent: number;
  codeBlockNode: CodeBlockNode;
  children?: React.ReactNode;
};

const PostCodeBlock = ({ format, indent, codeBlockNode, children }: Props) => {
  const style: CSS.Properties = {};

  if (format && format !== '') {
    style.textAlign = format as Property.TextAlign;
  }

  if (indent) {
    style.paddingInlineStart = `${indent * INDENTATION_FACTOR}px`;
  }

  // Replace empty paragraph from editor with <br>
  if (!codeBlockNode.children.length) {
    return <br></br>;
  }

  return (
    <code
      className={classes['post_code_block']}
      {...(style && { style: style })}
      data-language={codeBlockNode.language}
    >
      {children}
    </code>
  );
};

export default PostCodeBlock;

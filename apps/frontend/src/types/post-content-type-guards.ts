import {
  HorizontalRuleNode,
  ImageBlockNode,
  ImageNode,
  LinkNode,
  ParagraphNode,
  RootNode,
  StickyNode,
  TextNode,
} from './post-content-types';

export const isRootNode = (node: unknown): node is RootNode => {
  if (!node || typeof node !== 'object') {
    return false;
  }
  if (!('root' in node)) {
    return false;
  }
  return (node as RootNode).root.type === 'root';
};

export const isParagraphNode = (node: unknown): node is ParagraphNode => {
  return (node as ParagraphNode).type === 'paragraph';
};

export const isTextNode = (node: unknown): node is TextNode => {
  return (node as TextNode).type === 'text';
};

export const isLinkNode = (node: unknown): node is LinkNode => {
  return (node as LinkNode).type === 'link';
};

export const isHorizontalRuleNode = (
  node: unknown
): node is HorizontalRuleNode => {
  return (node as HorizontalRuleNode).type === 'horizontalrule';
};

export const isStickyNode = (node: unknown): node is StickyNode => {
  return (node as StickyNode).type === 'sticky';
};

export const isImageBlockNode = (node: unknown): node is ImageBlockNode => {
  return (node as ImageBlockNode).type === 'image-block';
};

export const isImageNode = (node: unknown): node is ImageNode => {
  return (node as ImageNode).type === 'image';
};

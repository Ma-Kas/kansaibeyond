import {
  HorizontalRuleNode,
  ImageBlockNode,
  ImageNode,
  LinkNode,
  ParagraphNode,
  HeadingNode,
  RootNode,
  StickyNode,
  TextNode,
  ListNode,
  ListItemNode,
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

export const isHeadingNode = (node: unknown): node is HeadingNode => {
  return (node as HeadingNode).type === 'heading';
};

export const isTextNode = (node: unknown): node is TextNode => {
  return (node as TextNode).type === 'text';
};

export const isLinkNode = (node: unknown): node is LinkNode => {
  return (
    (node as LinkNode).type === 'link' || (node as LinkNode).type === 'autolink'
  );
};

export const isHorizontalRuleNode = (
  node: unknown
): node is HorizontalRuleNode => {
  return (node as HorizontalRuleNode).type === 'horizontalrule';
};

export const isImageBlockNode = (node: unknown): node is ImageBlockNode => {
  return (node as ImageBlockNode).type === 'image-block';
};

export const isImageNode = (node: unknown): node is ImageNode => {
  return (node as ImageNode).type === 'image';
};

export const isListNode = (node: unknown): node is ListNode => {
  return (node as ListNode).type === 'list';
};

export const isListItemNode = (node: unknown): node is ListItemNode => {
  return (node as ListItemNode).type === 'listitem';
};

export const isStickyNode = (node: unknown): node is StickyNode => {
  return (node as StickyNode).type === 'sticky';
};

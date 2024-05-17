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
  CodeBlockNode,
  CodeHighlightNode,
  LineBreakNode,
  QuoteNode,
  ImageGalleryBlockNode,
  ImageGalleryContainerNode,
  ImageCarouselBlockNode,
  ImageCarouselContainerNode,
  EmbedBlockNode,
  EmbedNode,
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

export const isImageGalleryBlockNode = (
  node: unknown
): node is ImageGalleryBlockNode => {
  return (node as ImageGalleryBlockNode).type === 'gallery-block';
};

export const isImageGalleryContainerNode = (
  node: unknown
): node is ImageGalleryContainerNode => {
  return (node as ImageGalleryContainerNode).type === 'gallery-container';
};

export const isImageCarouselBlockNode = (
  node: unknown
): node is ImageCarouselBlockNode => {
  return (node as ImageCarouselBlockNode).type === 'carousel-block';
};

export const isImageCarouselContainerNode = (
  node: unknown
): node is ImageCarouselContainerNode => {
  return (node as ImageCarouselContainerNode).type === 'carousel-container';
};

export const isEmbedBlockNode = (node: unknown): node is EmbedBlockNode => {
  return (node as EmbedBlockNode).type === 'embed-block';
};

export const isEmbedNode = (node: unknown): node is EmbedNode => {
  return (node as EmbedNode).type === 'embed';
};

export const isListNode = (node: unknown): node is ListNode => {
  return (node as ListNode).type === 'list';
};

export const isListItemNode = (node: unknown): node is ListItemNode => {
  return (node as ListItemNode).type === 'listitem';
};

export const isQuoteNode = (node: unknown): node is QuoteNode => {
  return (node as QuoteNode).type === 'quote';
};

export const isCodeBlockNode = (node: unknown): node is CodeBlockNode => {
  return (node as CodeBlockNode).type === 'code';
};

export const isCodeHighlightNode = (
  node: unknown
): node is CodeHighlightNode => {
  return (node as CodeHighlightNode).type === 'code-highlight';
};

export const isLineBreakNode = (node: unknown): node is LineBreakNode => {
  return (node as LineBreakNode).type === 'linebreak';
};

export const isStickyNode = (node: unknown): node is StickyNode => {
  return (node as StickyNode).type === 'sticky';
};

////////////////////////////////////////////////////////////////////////////////
///                             HELPER TYPES                                 ///
////////////////////////////////////////////////////////////////////////////////
type DirectionType = 'ltr' | 'rtl' | null;

export type ElementFormatType =
  | 'left'
  | 'start'
  | 'center'
  | 'right'
  | 'end'
  | 'justify'
  | '';

export type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export type ImageAlignmentType = 'left' | 'right' | 'center' | undefined;

export type GalleryImageObjectPosition =
  | 'center'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';

export type GalleryGridType = 'dynamic-type' | 'static-type' | 'flex-type';

export type ImageNode = {
  altText: string;
  width: string | null | undefined;
  maxWidth: string | null | undefined;
  captionText: string;
  src: string;
  type: 'image';
  version: number;
};

export type GalleryImage = {
  id: number;
  altText: string;
  src: string;
  objectPosition?: GalleryImageObjectPosition | null;
  imageWidth?: string | null;
  aspectRatio?: string | null;
};

////////////////////////////////////////////////////////////////////////////////
///                               NODE TYPES                                 ///
////////////////////////////////////////////////////////////////////////////////
export type RootNode = {
  root: {
    children: object[];
    direction: DirectionType;
    format: ElementFormatType;
    indent: number;
    type: 'root';
    version: number;
  };
};

// Empty Paragraph (= line break) has empty children array and direction null
export type ParagraphNode = {
  children: object[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'paragraph';
  version: number;
};

export type HeadingNode = {
  children: object[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'heading';
  version: number;
  tag: HeadingTagType;
};

export type TextNode = {
  detail: number; // 0 = regular
  format: number; // 0 = regular, else number representation of bold, italic etc
  mode: 'normal' | 'token' | 'segmented';
  style: string; // inline css style
  text: string; // actual content to insert into tag
  type: 'text';
  version: number;
};

// Can't exist outside other paragraph, h1 etc node
export type LinkNode = {
  children: object[];
  direction: DirectionType;
  format: ElementFormatType;
  indent: number;
  type: 'link' | 'autolink';
  version: number;
  rel: string;
  target: string | null;
  title: string | null;
  url: string;
};

export type HorizontalRuleNode = {
  type: 'horizontalrule';
  version: number;
};

export type ImageBlockNode = {
  children: ImageNode[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'image-block';
  alignment: ImageAlignmentType;
  version: number;
};

export type ImageGalleryBlockNode = {
  children: ImageGalleryContainerNode[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'gallery-block';
  alignment: ImageAlignmentType;
  version: number;
};

export type ImageGalleryContainerNode = {
  imageList: GalleryImage[];
  gridType: GalleryGridType;
  columns?: number | null;
  captionText?: string;
  width?: string | null;
  maxWidth?: string | null;
  gridGap?: string | null;
  columnMinWidth?: number | null;
  type: 'gallery-container';
  version: number;
};

export type ListNode = {
  children: ListItemNode[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'list';
  version: number;
  listType: 'bullet' | 'number';
  start: number;
  tag: 'ul' | 'ol';
};

export type ListItemNode = {
  children: object[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'listitem';
  version: number;
  value: number;
};

export type QuoteNode = {
  children: object[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'quote';
  version: number;
};

export type CodeBlockNode = {
  children: object[];
  direction: DirectionType; // ltr or rtl
  format: ElementFormatType; // center, end, justify etc
  indent: number;
  type: 'code';
  version: number;
  language: string;
};

export type CodeHighlightNode = {
  detail: number; // 0 = regular
  format: number; // 0 = regular, else number representation of bold, italic etc
  mode: 'normal' | 'token' | 'segmented';
  style: string; // inline css style
  text: string; // actual content to insert into tag
  type: 'code-highlight';
  version: number;
  highlightType?: string;
};

export type LineBreakNode = {
  type: 'linebreak';
  version: number;
};

// Not relevant to frontend, just to rule out this type
export type StickyNode = {
  caption: {
    editorState: RootNode;
  };
  type: 'sticky';
  color: string;
  version: number;
  xOffset: number;
  yOffset: number;
};

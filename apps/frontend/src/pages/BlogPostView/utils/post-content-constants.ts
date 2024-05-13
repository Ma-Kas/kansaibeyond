import { Fragment } from 'react/jsx-runtime';
import PostRoot from '../../../components/BlogPostComponents/PostRoot/PostRoot';
import PostParagraph from '../../../components/BlogPostComponents/PostParagraph/PostParagraph';
import PostHorizontalRule from '../../../components/BlogPostComponents/PostHorizontalRule/PostHorizontalRule';
import PostText from '../../../components/BlogPostComponents/PostText/PostText';
import PostLink from '../../../components/BlogPostComponents/PostLink/PostLink';
import PostImageBlock from '../../../components/BlogPostComponents/PostImageBlock/PostImageBlock';
import PostImage from '../../../components/BlogPostComponents/PostImage/PostImage';

// Text node modes
export const IS_NORMAL = 0;
export const IS_TOKEN = 1;
export const IS_SEGMENTED = 2;
// IS_INERT = 3

// Text node formatting
export const IS_BOLD = 1;
export const IS_ITALIC = 1 << 1;
export const IS_STRIKETHROUGH = 1 << 2;
export const IS_UNDERLINE = 1 << 3;
export const IS_CODE = 1 << 4;
export const IS_SUBSCRIPT = 1 << 5;
export const IS_SUPERSCRIPT = 1 << 6;
export const IS_HIGHLIGHT = 1 << 7;

// Text node details
export const IS_DIRECTIONLESS = 1;
export const IS_UNMERGEABLE = 1 << 1;

// Element node formatting
export const IS_ALIGN_LEFT = 1;
export const IS_ALIGN_CENTER = 2;
export const IS_ALIGN_RIGHT = 3;
export const IS_ALIGN_JUSTIFY = 4;
export const IS_ALIGN_START = 5;
export const IS_ALIGN_END = 6;

export const keysToComponentMap = {
  root: PostRoot,
  paragraph: PostParagraph,
  text: PostText,
  link: PostLink,
  horizontalrule: PostHorizontalRule,
  'image-block': PostImageBlock,
  image: PostImage,
  sticky: Fragment,
};

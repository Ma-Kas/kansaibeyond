import { Fragment } from 'react/jsx-runtime';
import PostRoot from '../../../components/BlogPostComponents/PostRoot/PostRoot';
import PostParagraph from '../../../components/BlogPostComponents/PostParagraph/PostParagraph';
import PostHorizontalRule from '../../../components/BlogPostComponents/PostHorizontalRule/PostHorizontalRule';
import PostText from '../../../components/BlogPostComponents/PostText/PostText';
import PostLink from '../../../components/BlogPostComponents/PostLink/PostLink';
import PostImageBlock from '../../../components/BlogPostComponents/PostImageBlock/PostImageBlock';
import PostImage from '../../../components/BlogPostComponents/PostImage/PostImage';
import PostHeading from '../../../components/BlogPostComponents/PostHeading/PostHeading';
import PostList from '../../../components/BlogPostComponents/PostList/PostList';
import PostListItem from '../../../components/BlogPostComponents/PostListItem/PostListItem';

// Indentation
export const INDENTATION_FACTOR = 40; // Value in px to multiply the indent value with

// Text node modes
export const IS_NORMAL = 0;
export const IS_TOKEN = 1;
export const IS_SEGMENTED = 2;
// IS_INERT = 3

// Text node formatting
export const TEXT_FORMAT_STATES = {
  IS_BOLD: 1,
  IS_ITALIC: 1 << 1,
  IS_STRIKETHROUGH: 1 << 2,
  IS_UNDERLINE: 1 << 3,
  IS_CODE: 1 << 4,
  IS_SUBSCRIPT: 1 << 5,
  IS_SUPERSCRIPT: 1 << 6,
  IS_HIGHLIGHT: 1 << 7,
};

export const TEXT_FORMAT_ENUM = {
  IS_BOLD: 'IS_BOLD',
  IS_ITALIC: 'IS_ITALIC',
  IS_STRIKETHROUGH: 'IS_STRIKETHROUGH',
  IS_UNDERLINE: 'IS_UNDERLINE',
  IS_CODE: 'IS_CODE',
  IS_SUBSCRIPT: 'IS_SUBSCRIPT',
  IS_SUPERSCRIPT: 'IS_SUPERSCRIPT',
  IS_HIGHTLIGHT: 'IS_HIGHLIGHT',
};

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
  heading: PostHeading,
  text: PostText,
  link: PostLink,
  autolink: PostLink,
  horizontalrule: PostHorizontalRule,
  'image-block': PostImageBlock,
  image: PostImage,
  list: PostList,
  listitem: PostListItem,
  sticky: Fragment,
};

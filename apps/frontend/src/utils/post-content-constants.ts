import { Fragment } from 'react/jsx-runtime';
import PostRoot from '@/components/BlogPostComponents/PostRoot/PostRoot';
import PostParagraph from '@/components/BlogPostComponents/PostParagraph/PostParagraph';
import PostHorizontalRule from '@/components/BlogPostComponents/PostHorizontalRule/PostHorizontalRule';
import PostText from '@/components/BlogPostComponents/PostText/PostText';
import PostHashtag from '@/components/BlogPostComponents/PostHashtag/PostHashtag';
import PostLink from '@/components/BlogPostComponents/PostLink/PostLink';
import PostImageBlock from '@/components/BlogPostComponents/PostImageBlock/PostImageBlock';
import PostImage from '@/components/BlogPostComponents/PostImage/PostImage';
import PostHeading from '@/components/BlogPostComponents/PostHeading/PostHeading';
import PostList from '@/components/BlogPostComponents/PostList/PostList';
import PostListItem from '@/components/BlogPostComponents/PostListItem/PostListItem';
import PostCodeBlock from '@/components/BlogPostComponents/PostCodeBlock/PostCodeBlock';
import PostCodeHighlight from '@/components/BlogPostComponents/PostCodeHighlight/PostCodeHighlight';
import PostQuote from '@/components/BlogPostComponents/PostQuote/PostQuote';
import PostGalleryBlock from '@/components/BlogPostComponents/PostGalleryBlock/PostGalleryBlock';
import PostGalleryContainer from '@/components/BlogPostComponents/PostGalleryContainer/PostGalleryContainer';
import PostCarouselBlock from '@/components/BlogPostComponents/PostCarouselBlock/PostCarouselBlock';
import PostCarouselContainer from '@/components/BlogPostComponents/PostCarouselContainer/PostCarouselContainer';
import PostEmbedBlock from '@/components/BlogPostComponents/PostEmbedBlock/PostEmbedBlock';
import PostEmbed from '@/components/BlogPostComponents/PostEmbed/PostEmbed';

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
  hashtag: PostHashtag,
  autolink: PostLink,
  horizontalrule: PostHorizontalRule,
  'image-block': PostImageBlock,
  image: PostImage,
  'gallery-block': PostGalleryBlock,
  'gallery-container': PostGalleryContainer,
  'carousel-block': PostCarouselBlock,
  'carousel-container': PostCarouselContainer,
  'embed-block': PostEmbedBlock,
  embed: PostEmbed,
  quote: PostQuote,
  list: PostList,
  listitem: PostListItem,
  code: PostCodeBlock,
  'code-highlight': PostCodeHighlight,
  sticky: Fragment,
};

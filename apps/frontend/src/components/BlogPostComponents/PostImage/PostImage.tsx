import parseInlineStyle from '../../../utils/parse-inline-style-string';
import {
  CLOUDINARY_BASE_URL,
  POST_SINGLE_IMAGE_TRANSFORM,
} from '../../../config/constants';

type Props = {
  className: string;
  style?: string;
  src: string;
};

const PostImage = ({ className, style, src }: Props) => {
  return (
    <img
      className={className}
      src={`${CLOUDINARY_BASE_URL}${POST_SINGLE_IMAGE_TRANSFORM}${src}`}
      {...(style && { style: parseInlineStyle(style) })}
    />
  );
};

export default PostImage;

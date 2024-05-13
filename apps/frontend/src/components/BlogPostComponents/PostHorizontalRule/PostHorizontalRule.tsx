import parseInlineStyle from '../../../utils/parse-inline-style-string';

type Props = {
  className: string;
  style?: string;
};

const PostHorizontalRule = ({ className, style }: Props) => {
  return (
    <div
      className={className}
      {...(style && { style: parseInlineStyle(style) })}
    ></div>
  );
};

export default PostHorizontalRule;

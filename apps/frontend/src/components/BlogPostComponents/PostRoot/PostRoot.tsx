import parseInlineStyle from '../../../utils/parse-inline-style-string';

type Props = {
  className: string;
  style?: string;
  children?: React.ReactNode;
};

const PostRoot = ({ className, style, children }: Props) => {
  return (
    <section
      className={className}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {children}
    </section>
  );
};

export default PostRoot;

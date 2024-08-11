import BlurryLoadingImage from '../BlurryLoadingImage/BlurryLoadingImage';
import { ImageNode } from '@/types/post-content-types';

import classes from './PostImage.module.css';

type Props = {
  src: string;
  alt: string;
  node: ImageNode;
};

const PostImage = ({ node }: Props) => {
  return <BlurryLoadingImage node={node} className={classes['post_image']} />;
};

export default PostImage;

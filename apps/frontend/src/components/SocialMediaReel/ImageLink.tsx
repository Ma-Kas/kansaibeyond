import Image from 'next/image';
import {
  CLOUDINARY_BASE_URL,
  SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM,
} from '@/config/constants';
import getBase64ImageUrl from '@/utils/get-bas64-image-url';

import classes from './SocialMediaReel.module.css';

type Props = {
  item: {
    id: number;
    url: string;
    image: {
      urlSlug: string;
      altText: string;
    };
  };
};

const ImageLink = async ({ item }: Props) => {
  const blurDataUrl = await getBase64ImageUrl(item.image.urlSlug);

  return (
    <a
      key={item.id}
      className={classes['image_container']}
      href={item.url}
      target='_blank'
      rel='noopener noreferrer'
    >
      <Image
        className={classes.image}
        src={`${CLOUDINARY_BASE_URL}${SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM}${item.image.urlSlug}`}
        alt={item.image.altText}
        sizes='(max-width: 640px) 90vw, 250px'
        fill
        placeholder='blur'
        blurDataURL={blurDataUrl}
      />
    </a>
  );
};

export default ImageLink;

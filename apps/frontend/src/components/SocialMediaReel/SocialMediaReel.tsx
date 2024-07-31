import Image from 'next/image';
import SectionHeading from '../SectionHeading/SectionHeading';
import { getSocialMediaReel } from '@/lib/requests/socialMediaReelRequests';
import {
  CLOUDINARY_BASE_URL,
  SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM,
} from '@/config/constants';

import classes from './SocialMediaReel.module.css';

const SocialMediaReel = async () => {
  const socialMediaReel = await getSocialMediaReel();

  return (
    <section className={classes.section}>
      <SectionHeading>
        <span>Social</span>&nbsp;media
      </SectionHeading>
      <div className={classes['section_content']}>
        <div className={classes['images_container']}>
          {socialMediaReel.reelData.map((item) => {
            return (
              <a
                key={item.id}
                className={classes['image_container']}
                href={item.url}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={item.url}
              >
                <Image
                  className={classes.image}
                  src={`${CLOUDINARY_BASE_URL}${SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM}${item.image.urlSlug}`}
                  alt={item.image.altText}
                  sizes='(max-width: 640px) 90vw, 250px'
                  fill
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaReel;

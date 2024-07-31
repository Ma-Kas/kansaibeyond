/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
/* eslint @typescript-eslint/no-unsafe-return: 0 */
// Necessary due to Next.js typing svg in Image component as "any"

import Image from 'next/image';
import SectionHeading from '../SectionHeading/SectionHeading';
import { getSocialMediaReel } from '@/lib/requests/socialMediaReelRequests';
import {
  CLOUDINARY_BASE_URL,
  SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM,
} from '@/config/constants';
import twitterIcon from '@public/images/brand-x.svg';
import instagramIcon from '@public/images/brand-instagram.svg';
import facebookIcon from '@public/images/brand-facebook.svg';
import youTubeIcon from '@public/images/brand-youtube.svg';
import generalIcon from '@public/images/messages.svg';

import classes from './SocialMediaReel.module.css';

const switchIconOnSocial = (url: string) => {
  if (url.includes('twitter') || url.includes('x.com')) {
    return twitterIcon;
  } else if (url.includes('instagram')) {
    return instagramIcon;
  } else if (url.includes('facebook')) {
    return facebookIcon;
  } else if (url.includes('youtube')) {
    return youTubeIcon;
  } else {
    return generalIcon;
  }
};

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
                  className={classes['social_icon']}
                  src={switchIconOnSocial(item.url.toLowerCase())}
                  alt=''
                />
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

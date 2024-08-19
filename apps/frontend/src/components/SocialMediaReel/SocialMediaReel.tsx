import Image, { type StaticImageData } from 'next/image';
import SectionHeading from '../SectionHeading/SectionHeading';
import { getSocialMediaReel } from '@/lib/requests/socialMediaReelRequests';
import {
  WSRV_BASE_URL,
  CLOUDINARY_BASE_URL,
  SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM,
  WSRV_TRANSFORM,
  KANSAIBEYOND_INSTAGRAM,
} from '@/config/constants';
import twitterIcon from '@public/images/brand-x.svg';
import instagramIcon from '@public/images/brand-instagram.svg';
import facebookIcon from '@public/images/brand-facebook.svg';
import youTubeIcon from '@public/images/brand-youtube.svg';
import thatchIcon from '@public/images/brand-thatch.svg';
import generalIcon from '@public/images/messages.svg';

import placeholder_1 from '@public/images/social_placeholder_1_opt_a.webp';
import placeholder_2 from '@public/images/social_placeholder_2_opt_a.webp';
import placeholder_3 from '@public/images/social_placeholder_3_opt_a.webp';
import placeholder_4 from '@public/images/social_placeholder_4_opt_a.webp';
import placeholder_5 from '@public/images/social_placeholder_5_opt_a.webp';

import classes from './SocialMediaReel.module.css';

const mapPlaceholderImages = (id: number) => {
  switch (id) {
    case 1:
      return placeholder_1;
    case 2:
      return placeholder_2;
    case 3:
      return placeholder_3;
    case 4:
      return placeholder_4;
    default:
      return placeholder_5;
  }
};

const switchIconOnSocial = (url: string): StaticImageData => {
  if (url.includes('twitter') || url.includes('x.com')) {
    return twitterIcon as StaticImageData;
  } else if (url.includes('instagram')) {
    return instagramIcon as StaticImageData;
  } else if (url.includes('facebook')) {
    return facebookIcon as StaticImageData;
  } else if (url.includes('youtube')) {
    return youTubeIcon as StaticImageData;
  } else if (url.includes('thatch')) {
    return thatchIcon as StaticImageData;
  } else {
    return generalIcon as StaticImageData;
  }
};

const SocialMediaReel = async () => {
  try {
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
                    src={`${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${SOCIAL_MEDIA_REEL_IMAGE_TRANSFORM}${item.image.urlSlug}${WSRV_TRANSFORM}`}
                    alt={item.image.altText}
                    sizes='(max-width: 640px) 90vw, 210px'
                    fill
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  } catch (err: unknown) {
    return (
      <section className={classes.section}>
        <SectionHeading>
          <span>Social</span>&nbsp;media
        </SectionHeading>
        <div className={classes['section_content']}>
          <div className={classes['images_container']}>
            {[...Array(5).keys()].map((value) => {
              return (
                <a
                  key={value}
                  className={classes['image_container']}
                  href={KANSAIBEYOND_INSTAGRAM}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={KANSAIBEYOND_INSTAGRAM}
                >
                  <Image
                    className={classes['social_icon']}
                    src={instagramIcon as StaticImageData}
                    alt=''
                  />
                  <Image
                    className={classes.image}
                    src={mapPlaceholderImages(value + 1)}
                    alt='An autum color scene with the Kansai & Beyond logo in the middle'
                    sizes='(max-width: 640px) 90vw, 250px'
                    fill
                    placeholder='blur'
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
};

export default SocialMediaReel;

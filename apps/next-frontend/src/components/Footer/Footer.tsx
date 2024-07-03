/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
// Necessary due to Next.js typing svg in Image component as "any"

import Image from 'next/image';
import Link from 'next/link';
import PandaImage from '@public/images/takoyaki_panda.png';
import TwitterIcon from '@public/images/brand-x.svg';
import InstagramIcon from '@public/images/brand-instagram.svg';
import YouTubeIcon from '@public/images/brand-youtube.svg';
import {
  KANSAIBEYOND_TWITTER,
  KANSAIBEYOND_INSTAGRAM,
  KANSAIBEYOND_YOUTUBE,
} from '@/config/constants';

import classes from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={classes['page_footer']}>
      <div className={classes['footer_content']}>
        <Image
          className={classes['footer_image']}
          src={PandaImage}
          alt='A red panda with takoyaki'
          aria-hidden={true}
        />
        <p className={classes['footer_text_desktop']}>
          © {new Date().getFullYear()} Kansai & Beyond&nbsp;|&nbsp;
          <Link className={classes['footer_link']} href={'/privacy-policy'}>
            Privacy Policy
          </Link>
          &nbsp;|&nbsp;
          <Link className={classes['footer_link']} href={'/sitemap'}>
            Sitemap
          </Link>
        </p>
        <p className={classes['footer_text_mobile']}>
          © {new Date().getFullYear()} Kansai & Beyond
        </p>
        <p className={classes['footer_text_mobile']}>
          <Link className={classes['footer_link']} href={'/privacy-policy'}>
            Privacy Policy
          </Link>
          &nbsp;|&nbsp;
          <Link className={classes['footer_link']} href={'/sitemap'}>
            Sitemap
          </Link>
        </p>
        <div className={classes['footer_social_group']}>
          <a
            title='Kansai & Beyond Twitter profile'
            href={KANSAIBEYOND_TWITTER}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              className={classes['footer_social_icon']}
              src={TwitterIcon}
              alt='Kansai & Beyond X (formerly Twitter) profile'
            />
          </a>
          <a
            title='Kansai & Beyond Instagram account'
            href={KANSAIBEYOND_INSTAGRAM}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              className={classes['footer_social_icon']}
              src={InstagramIcon}
              alt='Kansai & Beyond Instagram account'
            />
          </a>
          <a
            title='Kansai & Beyond YouTube channel'
            href={KANSAIBEYOND_YOUTUBE}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              className={classes['footer_social_icon']}
              src={YouTubeIcon}
              alt='Kansai & Beyond YouTube channel'
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

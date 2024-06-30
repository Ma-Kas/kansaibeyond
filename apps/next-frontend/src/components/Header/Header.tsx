'use client';

import Image from 'next/image';
import Link from 'next/link';

import HeaderBannerImage from '@public/images/header_banner.png';
import NavLinks from '../NavLinks/NavLinks';

import classes from './Header.module.css';

export type NavLink = {
  name: string;
  href: string;
};

const navLinksLeft: NavLink[] = [
  {
    name: 'Blog',
    href: '/blog',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Travel Guides',
    href: '/travel-guides',
  },
];

const navLinksRight: NavLink[] = [
  {
    name: 'Japan Sites',
    href: '/japan-sites',
  },
  {
    name: 'A Taste of Hong Kong',
    href: '/taste-of-hong-kong',
  },
];

const Header = () => {
  return (
    <header className={classes['page_header_desktop']}>
      <nav className={classes['header_nav_left']}>
        <NavLinks navLinks={navLinksLeft} />
      </nav>
      <Link
        title='Link to home'
        href={'/'}
        className={classes['header_image_container']}
      >
        <Image
          className={classes['header_image_desktop']}
          src={HeaderBannerImage}
          alt='Kansai & Beyond Logo'
          priority={true}
          aria-hidden={true}
        />
      </Link>
      <nav className={classes['header_nav_right']}>
        <NavLinks navLinks={navLinksRight} />
      </nav>
    </header>
  );
};

export default Header;

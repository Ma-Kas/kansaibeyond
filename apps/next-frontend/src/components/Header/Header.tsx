'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cx from 'clsx';

import HeaderBannerImage from '@public/images/kb_logo_opt_a.webp';
import { KANSAIBEYOND_THATCH } from '@/config/constants';

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

const createNavLinks = (navLinks: NavLink[], pathname: string) => {
  return navLinks.map((link) => {
    return (
      <Link
        className={
          // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
          cx(classes['header_nav_link'], {
            [classes['nav_link_current']]: pathname === link.href,
          })
        }
        key={link.name}
        href={link.href}
      >
        {link.name.toUpperCase()}
      </Link>
    );
  });
};

const Header = () => {
  const pathname = usePathname();
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  useEffect(() => {
    setHeaderMenuOpen(false);
  }, [pathname]);

  const handleHamburgerMenu = () => {
    setHeaderMenuOpen(!headerMenuOpen);
  };

  return (
    <header className={classes['page_header']}>
      <nav className={classes['header_nav_left']}>
        {createNavLinks(navLinksLeft, pathname)}
        <a
          className={classes['header_nav_link']}
          title='Travel Guides'
          href={KANSAIBEYOND_THATCH}
          target='_blank'
          rel='noopener noreferrer'
        >
          TRAVEL GUIDES
        </a>
      </nav>
      <Link
        title='Home'
        href={'/'}
        className={classes['header_image_container']}
      >
        <Image
          className={classes['header_image']}
          src={HeaderBannerImage}
          alt='Kansai & Beyond Logo'
          priority={true}
          aria-hidden={true}
        />
      </Link>
      <nav className={classes['header_nav_right']}>
        {createNavLinks(navLinksRight, pathname)}
      </nav>

      {/* Mobile Hamburger Menu */}
      <button
        className={classes['header_hamburger_btn']}
        aria-label='Navigation Menu'
        aria-controls='navigation-main'
        aria-expanded={headerMenuOpen}
        onClick={handleHamburgerMenu}
      >
        <svg
          className={classes.hamburger}
          viewBox='0 0 100 100'
          width={30}
          fill='var(--color-page-off-black)'
        >
          <rect
            className={classes['hamburger_top']}
            width={80}
            height={10}
            x={10}
            y={25}
            rx={2.5}
          ></rect>
          <rect
            className={classes['hamburger_middle']}
            width={80}
            height={10}
            x={10}
            y={45}
            rx={2.5}
          ></rect>
          <rect
            className={classes['hamburger_bottom']}
            width={80}
            height={10}
            x={10}
            y={65}
            rx={2.5}
          ></rect>
        </svg>
      </button>

      {/* Mobile Navigation Dropdown */}
      <nav
        className={classes['header_nav_mobile']}
        data-is-open={headerMenuOpen}
        id='navigation-main'
      >
        {createNavLinks(navLinksLeft, pathname)}
        <a
          className={classes['header_nav_link']}
          title='Travel Guides'
          href={KANSAIBEYOND_THATCH}
          target='_blank'
          rel='noopener noreferrer'
        >
          TRAVEL GUIDES
        </a>
        {createNavLinks(navLinksRight, pathname)}
      </nav>
    </header>
  );
};

export default Header;

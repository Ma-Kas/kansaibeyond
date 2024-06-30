'use client';

import cx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLink } from '../Header/Header';

import classes from './NavLinks.module.css';

const NavLinks = ({ navLinks }: { navLinks: NavLink[] }) => {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map((link) => {
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
      })}
    </>
  );
};

export default NavLinks;

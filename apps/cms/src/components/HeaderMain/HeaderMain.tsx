import { Group, Container } from '@mantine/core';
import HeaderUserMenu from '../HeaderUserMenu/HeaderUserMenu';
import {
  FRONTEND_BASE_URL,
  KANSAIBEYOND_EMAIL,
  HEADER_ABOUT_LINK,
} from '../../config/constants';

import classes from './HeaderMain.module.css';

const menuLinks = [
  { link: HEADER_ABOUT_LINK, label: 'About' },
  { link: `mailto:${KANSAIBEYOND_EMAIL}`, label: 'Support' },
];

const titleLink = {
  link: FRONTEND_BASE_URL,
  label: 'Kansai & Beyond',
};

const HeaderMain = ({ authorized }: { authorized: boolean }) => {
  const items = menuLinks.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        target='_blank'
        rel='noopener noreferrer'
        className={classes.link}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container fluid>
        <div className={classes.inner}>
          <a
            key={titleLink.link}
            href={titleLink.link}
            target='_blank'
            rel='noopener noreferrer'
            className={classes.link}
          >
            {titleLink.label}
          </a>

          <Group gap={5} ml={'auto'}>
            {items}
          </Group>

          {authorized && <HeaderUserMenu />}
        </div>
      </Container>
    </header>
  );
};

export default HeaderMain;

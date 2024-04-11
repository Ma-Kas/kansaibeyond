import { Group, Container } from '@mantine/core';
import HeaderUserMenu from '../HeaderUserMenu/HeaderUserMenu';

import classes from './HeaderMain.module.css';

const menuLinks = [
  { link: 'https://github.com/Ma-Kas/kansaibeyond', label: 'About' },
  { link: 'https://github.com/Ma-Kas/kansaibeyond', label: 'Support' },
];

const titleLink = {
  link: 'http://www.kansaibeyond.com',
  label: 'Kansai & Beyond',
};

const HeaderMain = () => {
  const items = menuLinks.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        target='_blank'
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
            className={classes.link}
          >
            {titleLink.label}
          </a>

          <Group gap={5} ml={'auto'}>
            {items}
          </Group>

          <HeaderUserMenu />
        </div>
      </Container>
    </header>
  );
};

export default HeaderMain;

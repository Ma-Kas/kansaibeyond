import { Menu, Group, Center, Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import HeaderUserMenu from '../HeaderUserMenu/HeaderUserMenu';
import classes from './HeaderMain.module.css';

const menuLinks = [
  { link: '/features', label: 'Features' },
  { link: '/about', label: 'About' },
  {
    link: '/support',
    label: 'Support',
    links: [
      { link: '/faq', label: 'FAQ' },
      { link: '/demo', label: 'Book a demo' },
      { link: '/forums', label: 'Forums' },
    ],
  },
];
const titleLink = { link: '/kansaibeyond', label: 'Kansai & Beyond' };

const HeaderMain = () => {
  const [opened, { toggle }] = useDisclosure(false);

  const items = menuLinks.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger='hover'
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size='0.9rem' stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
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
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            {titleLink.label}
          </a>

          <Group gap={5} visibleFrom='xs' ml={'auto'}>
            {items}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            size='sm'
            hiddenFrom='xs'
            ml={'auto'}
          />
          <HeaderUserMenu />
        </div>
      </Container>
    </header>
  );
};

export default HeaderMain;

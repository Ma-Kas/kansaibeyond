import { useState } from 'react';
import cx from 'clsx';

import { Avatar, Menu, Group, UnstyledButton, rem } from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconMessage,
  IconSettings,
} from '@tabler/icons-react';
import classes from './HeaderUserMenu.module.css';

const user = {
  name: 'Kansai & Beyond',
  image:
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
};

const HeaderUserMenu = () => {
  const [userMenuOpened, setHeaderUserMenuOpened] = useState(false);
  return (
    <Menu
      width={260}
      position='bottom-end'
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setHeaderUserMenuOpened(false)}
      onOpen={() => setHeaderUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={
            // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
            cx(classes.user, {
              [classes.userActive]: userMenuOpened,
            })
          }
        >
          <Group gap={7}>
            <Avatar src={user.image} alt={user.name} radius='xl' size={20} />
            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <Avatar src={user.image} alt={user.name} radius='xl' size={50} />
          }
        >
          {user.name}
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Content</Menu.Label>
        <Menu.Item
          leftSection={
            <IconMessage
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Your posts
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconMessage
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Your comments
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          leftSection={
            <IconSettings
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Account settings
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default HeaderUserMenu;

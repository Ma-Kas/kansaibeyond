import { useState } from 'react';
import cx from 'clsx';

import {
  Avatar,
  Menu,
  Group,
  UnstyledButton,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconMessage,
  IconSettings,
  IconStar,
} from '@tabler/icons-react';
import classes from './UserMenu.module.css';

const user = {
  name: 'Kansai & Beyond',
  image:
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
};

const UserMenu = () => {
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  return (
    <Menu
      width={260}
      position='bottom-end'
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={
            // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
            cx(classes.user, {
              [classes.userActive]: userMenuOpened,
            }) as string
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
        <Menu.Label>Content</Menu.Label>
        <Menu.Item
          leftSection={
            <IconStar
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.yellow[6]}
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
              color={theme.colors.blue[6]}
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

export default UserMenu;

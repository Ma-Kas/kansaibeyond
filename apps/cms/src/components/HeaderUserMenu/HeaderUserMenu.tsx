import { useState } from 'react';
import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Avatar, Menu, Group, UnstyledButton, rem } from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconMessage,
  IconSettings,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLogout } from '../../requests/logoutRequests';
import {
  ErrorNotification,
  SuccessNotification,
} from '../FeedbackPopups/FeedbackPopups';
import { ConfirmLogoutModal } from '../FeedbackModals/FeedbackModals';

import classes from './HeaderUserMenu.module.css';

const user = {
  name: 'Kansai & Beyond',
  image: null,
};

const HeaderUserMenu = () => {
  const [userMenuOpened, setHeaderUserMenuOpened] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => deleteLogout(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      notifications.show(
        SuccessNotification({ bodyText: 'Successfully logged out.' })
      );
      navigate(`/`);
    },
    onError: (err) => {
      notifications.show(ErrorNotification({ bodyText: err.message }));
    },
  });

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
            <IconChevronDown />
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
          onClick={() =>
            modals.openConfirmModal(
              ConfirmLogoutModal({
                titleText: `Log out?`,
                bodyText: `Are you sure you want to log out? Any unsaved changes on this page might be lost.`,
                onConfirm: () => logoutMutation.mutate(),
              })
            )
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default HeaderUserMenu;

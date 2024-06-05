import { useState } from 'react';
import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Avatar, Menu, Group, UnstyledButton, rem } from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconMessage,
  IconMessages,
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
import useAuth from '../../hooks/useAuth';
import {
  CLOUDINARY_BASE_URL,
  USER_LIST_THUMB_TRANSFORM,
} from '../../config/constants';

import classes from './HeaderUserMenu.module.css';

const HeaderUserMenu = () => {
  const { user } = useAuth();
  const loggedInUser = user!;

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
            cx(classes['user_menu'], {
              [classes.userActive]: userMenuOpened,
            })
          }
        >
          <Group gap={7}>
            <Avatar
              src={
                loggedInUser.userIcon
                  ? `${CLOUDINARY_BASE_URL}${USER_LIST_THUMB_TRANSFORM}${loggedInUser.userIcon}`
                  : null
              }
              alt={loggedInUser.displayName}
              radius='xl'
              size={20}
            />
            <IconChevronDown />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          classNames={{ itemLabel: classes['user_menu_heading'] }}
          className={classes['user_menu_heading_container']}
          leftSection={
            <Avatar
              src={
                loggedInUser.userIcon
                  ? `${CLOUDINARY_BASE_URL}${USER_LIST_THUMB_TRANSFORM}${loggedInUser.userIcon}`
                  : null
              }
              alt={loggedInUser.displayName}
              radius='xl'
              size={50}
            />
          }
          component='div'
        >
          <div>{loggedInUser.displayName}</div>
          <div>{`${loggedInUser.role[0]}${loggedInUser.role
            .slice(1)
            .toLowerCase()}`}</div>
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
          onClick={() =>
            navigate(`/dashboard/blog/posts?filter=${loggedInUser.id}`)
          }
        >
          Your posts
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconMessages
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          onClick={() =>
            navigate(`/dashboard/blog/comments?filter=${loggedInUser.id}`)
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
          onClick={() =>
            navigate(`/dashboard/users/${loggedInUser.username}/edit`)
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

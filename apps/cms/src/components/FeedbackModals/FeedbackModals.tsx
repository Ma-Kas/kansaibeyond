import { Text } from '@mantine/core';
import classes from './FeedbackModals.module.css';

type ConfirmDeleteProps = {
  titleText: string;
  bodyText: string;
  onConfirm: () => void;
};

type ErrorNotificationProps = {
  titleText: string;
  bodyText: string;
};

export const ConfirmDeleteModal = ({
  titleText,
  bodyText,
  onConfirm,
}: ConfirmDeleteProps) => {
  return {
    title: <Text className={classes['title']}>{titleText}</Text>,
    centered: true,
    children: <Text className={classes['body']}>{bodyText}</Text>,
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    cancelProps: { className: classes['cancelBtn'] },
    confirmProps: { className: classes['deleteBtn'] },
    onConfirm: onConfirm,
  };
};

export const ConfirmTrashModal = ({
  titleText,
  bodyText,
  onConfirm,
}: ConfirmDeleteProps) => {
  return {
    title: <Text className={classes['title']}>{titleText}</Text>,
    centered: true,
    children: <Text className={classes['body']}>{bodyText}</Text>,
    labels: { confirm: 'Trash', cancel: 'Cancel' },
    cancelProps: { className: classes['cancelBtn'] },
    confirmProps: { className: classes['deleteBtn'] },
    onConfirm: onConfirm,
  };
};

export const GeneralConfirmModal = ({
  titleText,
  bodyText,
  onConfirm,
}: ConfirmDeleteProps) => {
  return {
    title: <Text className={classes['title']}>{titleText}</Text>,
    centered: true,
    children: <Text className={classes['body']}>{bodyText}</Text>,
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    cancelProps: { className: classes['cancelBtn'] },
    confirmProps: { className: classes['confirmBtn'] },
    onConfirm: onConfirm,
  };
};

export const ErrorNotificationModal = ({
  titleText,
  bodyText,
}: ErrorNotificationProps) => {
  return {
    title: <Text className={classes['title']}>{titleText}</Text>,
    centered: true,
    children: (
      <>
        <Text className={classes['body']}>{bodyText}</Text>
      </>
    ),
  };
};

export const ConfirmLogoutModal = ({
  titleText,
  bodyText,
  onConfirm,
}: ConfirmDeleteProps) => {
  return {
    title: <Text className={classes['title']}>{titleText}</Text>,
    centered: true,
    children: <Text className={classes['body']}>{bodyText}</Text>,
    labels: { confirm: 'Logout', cancel: 'Cancel' },
    cancelProps: { className: classes['cancelBtn'] },
    confirmProps: { className: classes['deleteBtn'] },
    onConfirm: onConfirm,
  };
};

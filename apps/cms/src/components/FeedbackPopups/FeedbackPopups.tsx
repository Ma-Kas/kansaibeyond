import classes from './FeedbackPopups.module.css';

type NotificationProps = {
  titleText?: string;
  bodyText: string | null | undefined;
};

export const ErrorNotification = ({
  titleText = 'An Error occured!',
  bodyText,
}: NotificationProps) => {
  return {
    title: titleText,
    message: bodyText ? bodyText : '',
    color: 'red',
    classNames: classes,
    withBorder: true,
    withCloseButton: true,
  };
};

export const SuccessNotification = ({
  titleText = 'Success',
  bodyText,
}: NotificationProps) => {
  return {
    title: titleText,
    message: bodyText ? bodyText : '',
    classNames: classes,
    withBorder: true,
    withCloseButton: true,
  };
};

export const LoadingNotification = ({ bodyText }: NotificationProps) => {
  return {
    title: 'Now loading...',
    message: bodyText ? bodyText : '',
    classNames: classes,
    withBorder: true,
    loading: true,
    autoClose: false,
    withCloseButton: true,
  };
};

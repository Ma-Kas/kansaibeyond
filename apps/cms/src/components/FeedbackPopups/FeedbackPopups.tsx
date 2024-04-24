import classes from './FeedbackPopups.module.css';

type NotificationProps = {
  titleText?: string;
  bodyText: string | null | undefined;
};

export const ErrorNotification = ({
  titleText = 'Success',
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
  titleText = 'An Error occured!',
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

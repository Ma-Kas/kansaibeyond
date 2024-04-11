import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import classes from './ErrorPage.module.css';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={classes['error_container']}>
      <div className={classes.label}>404</div>
      <h1 className={classes.title}>Nothing to see here</h1>
      <p className={classes.description}>
        Page you are trying to open does not exist. You may have mistyped the
        address, or the page has been moved to another URL. If you think this is
        an error, contact support.
      </p>
      <Group justify='center'>
        <Button variant='subtle' size='md' onClick={() => navigate('/')}>
          Take me back to home page
        </Button>
      </Group>
    </div>
  );
};

export default ErrorPage;

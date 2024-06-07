import { useNavigate } from 'react-router-dom';
import RedPanda from '../../assets/images/red_panda_error.svg';
import { Button, Group } from '@mantine/core';

import classes from './ErrorPages.module.css';

const DisabledErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={classes['error_container']}>
      <div className={classes.label}>Oops</div>
      <p className={classes.title}>Your account is disabled</p>
      <div className={classes['error_cat_container']}>
        <img src={RedPanda} alt='Error image' />
      </div>
      <p className={classes['dynamic_description']}>
        If you just created your account, this is normal. Please give the admins
        a moment to activate your account.
      </p>
      <p className={classes['dynamic_description']}>
        Otherwise, there is probably a reason why your account has been
        disabled. If you believe this to be a mistake, please contact an admin.
      </p>
      <Group justify='center'>
        <Button
          type='button'
          variant='subtle'
          size='md'
          onClick={() => navigate(-1)}
        >
          Click here to go back
        </Button>
      </Group>
    </div>
  );
};

export default DisabledErrorPage;

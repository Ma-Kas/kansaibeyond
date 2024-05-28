import { useNavigate, Link } from 'react-router-dom';
import RedPanda from '../../assets/images/red_panda_error.svg';

import classes from './ErrorPages.module.css';

const DisabledErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={classes['error_container']}>
      <div className={classes.label}>Oops</div>
      <p className={classes['dynamic_heading']}>Your account is disabled</p>
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
        In the meantime, you can&nbsp;
        <span>
          <Link
            className={classes['link']}
            to={'..'}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            go back
          </Link>
        </span>
        .
      </p>
    </div>
  );
};

export default DisabledErrorPage;

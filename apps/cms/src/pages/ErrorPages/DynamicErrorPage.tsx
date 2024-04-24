import { useNavigate, Link } from 'react-router-dom';
import errorCat from '../../assets/images/cat_error.svg';

import classes from './ErrorPages.module.css';

const DynamicErrorPage = ({ error }: { error: Error }) => {
  const navigate = useNavigate();

  return (
    <div className={classes['error_container']}>
      <div className={classes.label}>Oops</div>
      <p className={classes['dynamic_heading']}>
        Something went wrong: {error.message}
      </p>
      <div className={classes['error_cat_container']}>
        <img src={errorCat} alt='Cat napping on laptop' />
      </div>
      <p className={classes['dynamic_description']}>
        This shouldn't have happened. Our cat is working hard on fixing the
        problem. In the meantime, you can try to reload the page, or&nbsp;
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

export default DynamicErrorPage;

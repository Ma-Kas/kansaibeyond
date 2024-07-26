import { ReactNode } from 'react';
import { createFriendlyErrorData } from '@/utils/create-friendly-error-data';

import classes from './ErrorPages.module.css';

type Props = {
  errorMessage: string;
  reset: () => void;
  children?: ReactNode;
};

const PostGridError = ({ errorMessage, reset, children }: Props) => {
  const errorData = createFriendlyErrorData(errorMessage);
  return (
    <section className={classes['post_grid_section']}>
      {children}
      <div className={classes['error_container']}>
        <div className={classes['error_content']}>
          <h3 className={classes.title}>{errorData.name}</h3>
          <p className={classes.description}>{errorData.description}</p>
          <button
            id='reload-error-button'
            className={classes.button}
            onClick={reset}
            aria-label='Reload page'
          >
            Try again
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostGridError;

import { createFriendlyErrorData } from '@/utils/create-friendly-error-data';

import classes from './ErrorPages.module.css';

const FeaturedPostError = ({
  errorMessage,
  reset,
}: {
  errorMessage: string;
  reset: () => void;
}) => {
  const errorData = createFriendlyErrorData(errorMessage);

  return (
    <article className={classes['featured_post']}>
      <div className={classes['featured_post_image']}>
        <div className={classes['featured_post_content']}>
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
      <div className={classes['featured_post_bottom']}>
        <div></div>
        <div></div>
      </div>
    </article>
  );
};

export default FeaturedPostError;

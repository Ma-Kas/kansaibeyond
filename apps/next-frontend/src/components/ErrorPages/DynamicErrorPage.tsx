/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
// Necessary due to Next.js typing svg in Image component as "any"

import Link from 'next/link';
import Image from 'next/image';
import errorPanda from '@public/images/red_panda_error.svg';
import { ERRORS_DICTIONARY } from '@/utils/backend-error-response-validation';

import classes from './ErrorPages.module.css';

const createFriendlyErrorData = (message: string) => {
  switch (message) {
    case ERRORS_DICTIONARY.BAD_REQUEST: {
      return {
        status: 400,
        name: message,
        description:
          "Seems like there is something wrong with the data. That's not on you, it's on us. It might be temporary, so you can either try to reload the page, or go back.",
      };
    }
    case ERRORS_DICTIONARY.NOT_FOUND: {
      return {
        status: 404,
        name: message,
        description:
          "Seems like we couldn't find some data you requested. It might have been removed, had its name changed, or is temporarily unavailable.",
      };
    }
    case ERRORS_DICTIONARY.SERVER_ERROR: {
      return {
        status: 500,
        name: message,
        description:
          'Seems like there was an error connecting to the server. Maybe it is down, or there is an issue with the connection. It might be temporary, so you can either try to reload the page, or go back.',
      };
    }
    default: {
      return {
        status: 500,
        name: message,
        description:
          "Seems like something just went very wrong. It can happen, and it just did. We're not sure why it happened, but you can try to reload the page, or go back.",
      };
    }
  }
};

const DynamicErrorPage = ({
  errorMessage,
  reset,
}: {
  errorMessage: string;
  reset: () => void;
}) => {
  const errorData = createFriendlyErrorData(errorMessage);

  return (
    <section className={classes['error_section']}>
      <article className={classes['error_content']}>
        <p className={classes.label}>{errorData.status}</p>
        <h1 className={classes.title}>{errorData.name}</h1>

        <Image
          className={classes['error_image']}
          src={errorPanda}
          alt=''
          priority={true}
        />

        <p className={classes.description}>{errorData.description}</p>
        <div className={classes['button_container']}>
          <button
            id='reload-error-button'
            className={classes.button}
            onClick={reset}
            aria-label='Reload page'
          >
            Try again
          </button>
          <Link
            className={classes['button_link']}
            title='Home'
            href={'/'}
            aria-label='Return to home'
          >
            Go to homepage
          </Link>
        </div>
      </article>
    </section>
  );
};

export default DynamicErrorPage;

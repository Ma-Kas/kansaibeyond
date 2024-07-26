/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
// Necessary due to Next.js typing svg in Image component as "any"

import Link from 'next/link';
import Image from 'next/image';
import errorPanda from '@public/images/red_panda_error.svg';
import { createFriendlyErrorData } from '@/utils/create-friendly-error-data';

import classes from './ErrorPages.module.css';

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

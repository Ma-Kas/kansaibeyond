import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import errorPanda from '@public/images/red_panda_error.svg';

import classes from './ErrorPages.module.css';

const NotFoundPage = () => {
  return (
    <section className={classes['error_section']}>
      <article className={classes['error_content']}>
        <p className={classes.label}>404</p>
        <h1 className={classes.title}>Page not found</h1>

        <Image
          className={classes['error_image']}
          src={errorPanda as StaticImageData}
          alt=''
          priority={true}
        />

        <p className={classes.description}>
          Seems like the page you are looking for does not exist. It might have
          been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          className={classes['button_link']}
          title='Home'
          href={'/'}
          aria-label='Return to home'
        >
          Go to homepage
        </Link>
      </article>
    </section>
  );
};

export default NotFoundPage;

import { ReactNode } from 'react';

import classes from './NoPosts.module.css';

type Props = {
  message: string;
  children?: ReactNode;
};

const NoPosts = ({ message, children }: Props) => {
  return (
    <section className={classes['no_posts_section']}>
      {children}
      <article className={classes['no_posts_content']}>
        <p>{message}</p>
      </article>
    </section>
  );
};

export default NoPosts;

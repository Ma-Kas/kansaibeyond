import Link from 'next/link';
import { KANSAIBEYOND_THATCH } from '@/config/constants';

import classes from './page.module.css';

const Home = () => {
  return (
    <>
      <section className={classes['welcome_section']}>
        <article className={classes['welcome_content']}>
          <h1>Welcome to</h1>
          <p>Kansai & Beyond</p>
          <p>
            Our blog is the go-to destination for anyone seeking a comprehensive
            and genuine account of life in Japan. We’re passionate about sharing
            everything Japan has to offer, from the delicious cuisine to the
            rich history and breathtaking scenery. Follow us on our journey as
            we explore this fascinating country and discover the true beauty of
            Japan.
          </p>
        </article>
      </section>
      <section className={classes['quickstart_section']}>
        <h2>
          <span>Jump</span>&nbsp;RIGHT IN
        </h2>
        <div className={classes['quickstart_card_container']}>
          <article className={classes['quickstart_card']}>
            <Link
              className={classes['quickstart_card_content']}
              title='Blog'
              href={'/blog'}
            >
              Blog
            </Link>
          </article>
          <article className={classes['quickstart_card']}>
            <a
              className={classes['quickstart_card_content']}
              title='Travel Guides'
              href={KANSAIBEYOND_THATCH}
              target='_blank'
              rel='noopener noreferrer'
            >
              Travel
              <br />
              Guides
            </a>
          </article>
        </div>
      </section>
    </>
  );
};

export default Home;

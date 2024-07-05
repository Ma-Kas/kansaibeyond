import Link from 'next/link';
import WelcomeImage from '@public/images/welcome_opt_d.webp';
import KimonoImage from '@public/images/kimono_opt_a.webp';
import FujiImage from '@public/images/fuji_opt_a.webp';
import { KANSAIBEYOND_THATCH } from '@/config/constants';

import classes from './page.module.css';
import Image from 'next/image';

const Home = () => {
  return (
    <>
      <section className={classes['welcome_section']}>
        <Image
          className={classes['welcome_section_bg_image']}
          src={WelcomeImage}
          alt=''
          priority={true}
          sizes='100vw'
          fill
          placeholder='blur'
        />
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
            <Image
              className={classes['quickstart_card_bg_image']}
              src={KimonoImage}
              alt=''
              sizes='550px'
              fill
              placeholder='blur'
            />
            <Link
              className={classes['quickstart_card_content']}
              title='Blog'
              href={'/blog'}
            >
              Blog
            </Link>
          </article>
          <article className={classes['quickstart_card']}>
            <Image
              className={classes['quickstart_card_bg_image']}
              src={FujiImage}
              alt=''
              sizes='550px'
              fill
              placeholder='blur'
            />
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

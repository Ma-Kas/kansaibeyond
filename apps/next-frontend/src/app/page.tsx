import classes from './page.module.css';

const Home = () => {
  return (
    <>
      <section className={classes['welcome_section']}>
        <div className={classes['welcome_content']}>
          <p>Welcome to</p>
          <p>Kansai & Beyond</p>
          <p>
            Our blog is the go-to destination for anyone seeking a comprehensive
            and genuine account of life in Japan. We’re passionate about sharing
            everything Japan has to offer, from the delicious cuisine to the
            rich history and breathtaking scenery. Follow us on our journey as
            we explore this fascinating country and discover the true beauty of
            Japan.
          </p>
        </div>
      </section>
    </>
  );
};

export default Home;

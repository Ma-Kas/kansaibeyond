import classes from './PostPage.module.css';

const Loading = () => {
  return (
    <article className={classes['post_main_skeleton']}>
      <div className={classes.loader}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </article>
  );
};

export default Loading;

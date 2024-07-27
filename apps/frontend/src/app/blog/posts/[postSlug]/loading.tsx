import dynamic from 'next/dynamic';

import classes from './PostPage.module.css';

const DynamicScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
});

const Loading = () => {
  return (
    <>
      <DynamicScrollToTop />
      <article className={classes['post_main_skeleton']}>
        <div className={classes.loader}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </article>
    </>
  );
};

export default Loading;

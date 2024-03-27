import React from 'react';
import classes from './PageBase.module.css';

interface PageBaseProps {
  children: React.ReactNode;
}

export const PageBase = ({ children }: PageBaseProps) => {
  return (
    <>
      <div className={classes['page_content']}>
        <div className={classes['content_wrapper']}>{children}</div>
      </div>
    </>
  );
};

export default PageBase;

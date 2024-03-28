import React from 'react';
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import ComposerSidebar from '../ComposerSidebar/ComposerSidebar';
import classes from './PageComposer.module.css';

interface PageComposerProps {
  children: React.ReactNode;
}

export const PageComposer = ({ children }: PageComposerProps) => {
  return (
    <>
      <ComposerHeader />
      <ComposerSidebar />
      <div className={classes['page_composer']}>{children}</div>
    </>
  );
};

export default PageComposer;

import React from 'react';
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import ComposerSidebar from '../ComposerSidebar/ComposerSidebar';
import classes from './PageEditor.module.css';

interface PageEditorProps {
  children: React.ReactNode;
}

export const PageEditor = ({ children }: PageEditorProps) => {
  return (
    <>
      <ComposerHeader />
      <ComposerSidebar />
      <div className={classes['page_editor']}>
        <div className={classes['content_wrapper']}>{children}</div>
      </div>
    </>
  );
};

export default PageEditor;

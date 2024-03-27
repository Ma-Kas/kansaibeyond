import React from 'react';
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import classes from './PageEditor.module.css';

interface PageEditorProps {
  children: React.ReactNode;
}

export const PageEditor = ({ children }: PageEditorProps) => {
  return (
    <>
      <ComposerHeader />
      <div className={classes['page_content']}>
        <div className={classes['content_wrapper']}>{children}</div>
      </div>
    </>
  );
};

export default PageEditor;

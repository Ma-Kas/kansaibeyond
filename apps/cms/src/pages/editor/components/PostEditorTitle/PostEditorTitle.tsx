import React, { useState } from 'react';
import classes from './PostEditorTitle.module.css';

const PostEditorTitle = ({
  setToolbarEnabled,
}: {
  setToolbarEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    autoResize(e.target);
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <div className={classes['editor-post-title-container']}>
      <textarea
        onFocus={() => setToolbarEnabled(false)}
        onBlur={() => setToolbarEnabled(true)}
        name='post-title'
        className={classes['editor-post-title-inner']}
        data-editor-component='post-title-textarea'
        placeholder='Add a Catchy Title'
        value={value}
        rows={1}
        maxLength={200}
        onChange={(e) => handleInput(e)}
      ></textarea>
    </div>
  );
};

export default PostEditorTitle;

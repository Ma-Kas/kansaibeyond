import React, { useRef, useEffect } from 'react';
import { usePostFormContext } from '../../../../components/PageShell/post-form-context';
import classes from './PostEditorTitle.module.css';

type Props = {
  setToolbarEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  loadedTitle?: string;
};

const PostEditorTitle = ({ setToolbarEnabled, loadedTitle }: Props) => {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const postForm = usePostFormContext();

  // In case title is loaded from backend, autoResize needs to be called to set
  // initial size
  useEffect(() => {
    if (titleRef.current) {
      autoResize(titleRef.current);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    postForm.setFieldValue('title', e.target.value);
    autoResize(e.target);
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <div className={classes['editor-post-title-container']}>
      <textarea
        ref={titleRef}
        onFocus={() => setToolbarEnabled(false)}
        onBlur={() => setToolbarEnabled(true)}
        name='post-title'
        className={classes['editor-post-title-inner']}
        data-editor-component='post-title-textarea'
        placeholder='Add a Catchy Title'
        // For intial render, needs to set value from prop instead of form, to avoid race condition
        // with async form state and scrollHeight
        value={
          postForm.getValues().title
            ? postForm.getValues().title
            : loadedTitle
            ? loadedTitle
            : ''
        }
        rows={1}
        maxLength={200}
        onChange={(e) => handleInput(e)}
      ></textarea>
    </div>
  );
};

export default PostEditorTitle;

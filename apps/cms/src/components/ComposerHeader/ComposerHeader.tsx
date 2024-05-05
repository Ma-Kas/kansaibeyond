import { Button, Divider, ActionIcon, Group } from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { usePostFormContext } from '../PageShell/post-form-context';
import { mergeRegister } from '@lexical/utils';

import { useNavigate } from 'react-router-dom';

import classes from './ComposerHeader.module.css';

const ComposerHeader = ({
  formRef,
}: {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const [editor] = useLexicalComposerContext();
  const postForm = usePostFormContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const navigate = useNavigate();

  // Update lexical editor selection
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  // Handle undo/redo ability
  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, editor]);

  const handleSave = useCallback(() => {
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState);
    postForm.setFieldValue('content', jsonString);
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef]);

  const handlePreview = useCallback(() => {
    console.log('implement preview here');
  }, []);

  return (
    <header className={classes.composerheader}>
      <div className={classes['composerheader-inner']}>
        <Button
          leftSection={<IconArrowLeft size={14} />}
          className={classes['plain-button']}
          variant='transparent'
          onClick={() => navigate('/dashboard/blog/posts')}
        >
          Back
        </Button>

        <Group ml={'auto'}>
          <ActionIcon
            variant='transparent'
            className={classes['plain-button']}
            disabled={!canUndo || !isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            title={'Undo (Ctrl+Z)'}
            aria-label='Undo'
          >
            <IconArrowBackUp className={classes['action-button']} />
          </ActionIcon>
          <ActionIcon
            variant='transparent'
            className={classes['plain-button']}
            disabled={!canRedo || !isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            title={'Redo (Ctrl+Y)'}
            aria-label='Redo'
          >
            <IconArrowForwardUp className={classes['action-button']} />
          </ActionIcon>
          <Divider orientation='vertical' />
          <Button
            className={classes['color-button']}
            variant='transparent'
            onClick={handleSave}
          >
            Save
          </Button>
          <Divider orientation='vertical' />
          <Button
            className={classes['color-button']}
            variant='transparent'
            onClick={() => handlePreview()}
          >
            Preview
          </Button>
          <Button
            radius={'xl'}
            style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
          >
            Publish
          </Button>
        </Group>
      </div>
    </header>
  );
};

export default ComposerHeader;

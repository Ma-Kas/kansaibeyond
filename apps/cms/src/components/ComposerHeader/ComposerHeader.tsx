import { Button, Divider, ActionIcon, Group } from '@mantine/core';

import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
} from '@tabler/icons-react';
import classes from './ComposerHeader.module.css';
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
import { mergeRegister } from '@lexical/utils';

const DEBUG_IMPORT_DATA = '';

const ComposerHeader = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

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

  const handleExportTest = useCallback(() => {
    editor.update(() => {
      const json = editor.getEditorState().toJSON();
      console.log(json);
      //console.log(JSON.stringify(json));
    });
  }, [editor]);

  const handleImportTest = useCallback(
    (data: string) => {
      editor.update(() => {
        const editorState = editor.parseEditorState(data);
        editor.setEditorState(editorState);
      });
    },
    [editor]
  );

  return (
    <header className={classes.composerheader}>
      <div className={classes['composerheader-inner']}>
        <Button
          leftSection={<IconArrowLeft size={14} />}
          className={classes['plain-button']}
          variant='transparent'
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
            onClick={handleExportTest}
          >
            Save
          </Button>
          <Divider orientation='vertical' />
          <Button
            className={classes['color-button']}
            variant='transparent'
            onClick={() => handleImportTest(DEBUG_IMPORT_DATA)}
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

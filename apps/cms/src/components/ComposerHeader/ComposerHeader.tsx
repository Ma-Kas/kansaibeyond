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
  CLEAR_HISTORY_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';

import { useNavigate } from 'react-router-dom';

import classes from './ComposerHeader.module.css';

const DEBUG_IMPORT_JSONB = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Henlo tank',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          {
            altText: 'Yellow flower in tilt shift lens',
            width: null,
            maxWidth: null,
            captionText: '',
            src: '/src/pages/Editor/images/yellow-flower.jpg',
            type: 'image',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'image-block',
        version: 1,
        alignment: 'center',
      },
      {
        children: [
          {
            imageList: [
              {
                id: 1,
                altText: 'Yellow flower in tilt shift lens',
                src: '/src/pages/Editor/images/yellow-flower.jpg',
                aspectRatio: '3 / 4',
              },
              {
                id: 2,
                altText:
                  'Daylight fir trees forest glacier green high ice landscape',
                src: '/src/pages/Editor/images/landscape.jpg',
                aspectRatio: '3 / 4',
              },
              {
                id: 3,
                altText: 'Yellow flower in tilt shift lens',
                src: '/src/pages/Editor/images/yellow-flower.jpg',
                aspectRatio: '3 / 4',
              },
              {
                id: 4,
                altText:
                  'Daylight fir trees forest glacier green high ice landscape',
                src: '/src/pages/Editor/images/landscape.jpg',
                aspectRatio: '3 / 4',
              },
            ],
            gridType: 'dynamic-type',
            width: null,
            maxWidth: null,
            captionText: '',
            gridGap: null,
            columnMinWidth: null,
            type: 'gallery-container',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'gallery-block',
        version: 1,
        alignment: 'center',
      },
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

const DEBUG_IMPORT_TEXT =
  '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Henlo tank","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"altText":"Yellow flower in tilt shift lens","width":null,"maxWidth":null,"captionText":"","src":"/src/pages/Editor/images/yellow-flower.jpg","type":"image","version":1}],"direction":null,"format":"","indent":0,"type":"image-block","version":1,"alignment":"center"},{"children":[{"imageList":[{"id":1,"altText":"Yellow flower in tilt shift lens","src":"/src/pages/Editor/images/yellow-flower.jpg","aspectRatio":"3 / 4"},{"id":2,"altText":"Daylight fir trees forest glacier green high ice landscape","src":"/src/pages/Editor/images/landscape.jpg","aspectRatio":"3 / 4"},{"id":3,"altText":"Yellow flower in tilt shift lens","src":"/src/pages/Editor/images/yellow-flower.jpg","aspectRatio":"3 / 4"},{"id":4,"altText":"Daylight fir trees forest glacier green high ice landscape","src":"/src/pages/Editor/images/landscape.jpg","aspectRatio":"3 / 4"}],"gridType":"dynamic-type","width":null,"maxWidth":null,"captionText":"","gridGap":null,"columnMinWidth":null,"type":"gallery-container","version":1}],"direction":null,"format":"","indent":0,"type":"gallery-block","version":1,"alignment":"center"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

const ComposerHeader = () => {
  const [editor] = useLexicalComposerContext();
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

  const handleExportTest = useCallback(() => {
    editor.update(() => {
      // string version to save in db as TEXT
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);
      console.log(jsonString);
      // json if saving in db as JSONB
      const json = editor.getEditorState().toJSON();
      console.log(json);
    });
  }, [editor]);

  const handleImportTest = useCallback(
    (data: string) => {
      editor.update(() => {
        // Re-import from TEXT
        const editorState = editor.parseEditorState(data);
        editor.setEditorState(editorState);
        // Re-import JSONB
        // const editorState = editor.parseEditorState(JSON.stringify(data));
        // editor.setEditorState(editorState);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
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
            // onClick={handleExportTest}
            form='edit-post-form'
            type='submit'
          >
            Save
          </Button>
          <Divider orientation='vertical' />
          <Button
            className={classes['color-button']}
            variant='transparent'
            onClick={() => handleImportTest(DEBUG_IMPORT_TEXT)}
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

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, ActionIcon, Group } from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  $getRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  EditorState,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { usePostFormContext } from '../PageShell/post-form-context';
import { GeneralConfirmModal } from '../FeedbackModals/FeedbackModals';
import { SuccessNotification } from '../FeedbackPopups/FeedbackPopups';
import {
  FRONTEND_BASE_URL,
  READ_TIME_WORDS_PER_MINUTE,
} from '../../config/constants';

import classes from './ComposerHeader.module.css';

type Props = {
  invalidateQueries: () => Promise<void>;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
};

const openPreviewInTab = (postSlug: string): void => {
  const previewWindow = window.open(
    `${FRONTEND_BASE_URL}/preview/${postSlug}`,
    '_blank',
    'noopener,noreferrer'
  );
  if (previewWindow) {
    previewWindow.opener = null;
  }
};

const ComposerHeader = ({ invalidateQueries, formRef }: Props) => {
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

  const handleBackButton = async () => {
    navigate('/dashboard/blog/posts');
    await invalidateQueries();
  };

  const setReadTime = (editorState: EditorState) => {
    // Get the text content of root node, and count words
    // Return approximate readtime by assuming xxx/min read speed
    editorState.read(() => {
      const wordArray = $getRoot().getTextContent().trim().split(/\s+/);
      postForm.setFieldValue(
        'readTime',
        Math.ceil(wordArray.length / READ_TIME_WORDS_PER_MINUTE)
      );
    });
  };

  const handleSave = useCallback(() => {
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState);
    postForm.setFieldValue('content', jsonString);
    setReadTime(editorState);
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef]);

  const handlePreview = () => {
    // Save current status
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState);
    postForm.setFieldValue('content', jsonString);

    if (formRef.current) {
      formRef.current.addEventListener(
        'postFormPreview',
        () => openPreviewInTab(postForm.getValues().postSlug),
        { once: true }
      );

      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  const handlePublish = useCallback(() => {
    // Set status to published, submit postForm
    postForm.setFieldValue('status', 'published');
    if (formRef.current) {
      // Await the success event of the postForm in ComposerShell
      formRef.current.addEventListener(
        'postFormSuccess',
        () => {
          notifications.show(
            SuccessNotification({
              bodyText: `Your post has been published.`,
            })
          );
          void (async () => {
            await handleBackButton();
          })();
        },
        { once: true }
      );

      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className={classes.composerheader}>
      <div className={classes['composerheader-inner']}>
        <Button
          type='button'
          leftSection={<IconArrowLeft size={14} />}
          className={classes['plain-button']}
          variant='transparent'
          onClick={() =>
            modals.openConfirmModal(
              GeneralConfirmModal({
                titleText: `Leave editor?`,
                bodyText: `Any changes since your last save will be lost.`,
                // IIFE to silence es-lint void/Promise<void> warning
                onConfirm: () => {
                  void (async () => {
                    await handleBackButton();
                  })();
                },
              })
            )
          }
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
            type='button'
            className={classes['color-button']}
            variant='transparent'
            onClick={handleSave}
          >
            Save
          </Button>
          <Divider orientation='vertical' />
          <Button
            type='button'
            className={classes['color-button']}
            variant='transparent'
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            type='button'
            radius={'xl'}
            style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
            onClick={() =>
              modals.openConfirmModal(
                GeneralConfirmModal({
                  titleText: `Save and publish this post?`,
                  bodyText: `You are about to publish post "${
                    postForm.getValues().title
                  }" to the website. Proceed?`,
                  // IIFE to silence es-lint void/Promise<void> warning
                  onConfirm: () => handlePublish(),
                })
              )
            }
          >
            Publish
          </Button>
        </Group>
      </div>
    </header>
  );
};

export default ComposerHeader;

import type {
  BaseSelection,
  EditorState,
  LexicalEditor,
  NodeKey,
} from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Tweet } from 'react-tweet';

import { $isEmbedNode, EmbedNode } from './EmbedNode';
import { Alignment, EmbedBlockNode } from './EmbedBlockNode';
import EmbedResizer from '../ui/EmbedResizer';
import EmbedMapsResizer from '../ui/EmbedMapsResizer';
import EmbedTwitterResizer from '../ui/EmbedTwitterResizer';
import ContentSettingsModalInner from '../components/ContentSettingsModal/ContentSettingsModalInner';
import { Textarea, Select } from '@mantine/core';
import classes from '../components/ContentSettingsModal/ContentSettingsModal.module.css';

const INSTAGRAM_SCRIPT_URL = 'https://www.instagram.com/embed.js';

function getBlockParentNode(
  editorState: EditorState,
  node: EmbedNode
): EmbedBlockNode {
  const parentNodeKey = node.__parent;
  return editorState.read(
    () => $getNodeByKey(parentNodeKey!) as EmbedBlockNode
  );
}

export function UpdateEmbedDialog({
  activeEditor,
  nodeKey,
  close,
}: {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
  close: () => void;
}): JSX.Element {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(() => $getNodeByKey(nodeKey) as EmbedNode);
  const embedType = node.getEmbedType();
  const [source, setSource] = useState(node.getSource());

  // Get the imageBlock node to set alignment there
  const parentBlockNode = getBlockParentNode(editorState, node);
  const [blockAlignment, setBlockAlignment] = useState<Alignment>(
    parentBlockNode.getAlignment()
  );

  useEffect(() => {
    setSource(node.getSource());
    setBlockAlignment(parentBlockNode.getAlignment());
  }, [node, parentBlockNode]);

  const handlePositionChange = (select: string | null) => {
    if (select) {
      setBlockAlignment(select as Alignment);
    }
  };

  const handleOnConfirm = () => {
    const payload = { source };
    if (node && parentBlockNode) {
      activeEditor.update(() => {
        node.update(payload);
        parentBlockNode.setAlignment(blockAlignment);
      });
    }
    close();
  };

  // Reset changed values and close modal
  const handleOnCancel = () => {
    setSource(node.getSource());
    setBlockAlignment(parentBlockNode.getAlignment());
    close();
  };

  return (
    <ContentSettingsModalInner
      title='Embed Settings'
      confirm={handleOnConfirm}
      cancel={handleOnCancel}
    >
      <div className={classes['content_settings_modal_content_inner_group']}>
        <Select
          label='Alignment on Page'
          data={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
          value={blockAlignment}
          onChange={(value, _option) => handlePositionChange(value)}
          allowDeselect={false}
          withCheckIcon={false}
        />
        {embedType === 'general' && (
          <Textarea
            autosize
            minRows={12}
            label='HTML Code'
            placeholder='Your raw embed HTML'
            value={source}
            onChange={(e) => setSource(e.currentTarget.value)}
          />
        )}
      </div>
    </ContentSettingsModalInner>
  );
}

export default function EmbedComponent({
  embedType,
  source,
  nodeKey,
  resizable,
}: {
  embedType: string;
  source: string;
  nodeKey: NodeKey;
  resizable: boolean;
  width: string | null | undefined;
  maxWidth: string | null | undefined;
  aspectRatio: string | null | undefined;
}): JSX.Element {
  const embedRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isEmbedNode(node)) {
          // Access the parent/grandparent imageBlockNode that contains this image
          const domElement = editor.getElementByKey(nodeKey);
          if (!domElement) {
            return false;
          }
          const parentBlock = domElement.closest(
            "[class^='EditorTheme__embedBlock']"
          );
          if (!parentBlock || !(parentBlock instanceof HTMLElement)) {
            return false;
          }
          const parentNode = $getNearestNodeFromDOMNode(parentBlock);
          if (!parentNode) {
            return false;
          }

          // Before deletion, select next node, so selection is not empty
          // would throw if trying to insert another node without selection
          parentNode.selectNext();

          // Delete parent EmbedBlockNode instead of just the image, to avoid having
          // empty block of wrong formatting to write into
          parentNode.remove();
          return true;
        }
      }
      return false;
    },
    [editor, isSelected, nodeKey]
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [isSelected]
  );

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [editor, setSelected]
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (isResizing) {
        return true;
      }
      if (event.target === embedRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection]
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === embedRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    );

    return () => {
      isMounted = false;
      unregister();
    };
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    onEnter,
    onEscape,
    onClick,
    setSelected,
  ]);

  // Insert and load instagram script when a tweet is embedded
  useEffect(() => {
    if (embedType !== 'instagram') {
      return;
    }
    // // If script alreay exists, don't create another one
    const existingScript = document.querySelectorAll('[data-type="instagram"]');
    if (!existingScript.length) {
      const script = document.createElement('script');
      script.src = INSTAGRAM_SCRIPT_URL;
      script.dataset.type = 'instagram';
      script.async = true;
      document.body?.appendChild(script);
    }

    // Force reload the widget to style embedded html code
    // @ts-expect-error Instagram is attached to the window.
    if (window.instgrm) {
      // @ts-expect-error Instagram is attached to the window.
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
      window.instgrm.Embeds.process();
    }
  }, [embedType]);

  const onResizeEnd = (width: string, maxWidth: string) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    // Set values in EmbedNode that will be necessary for serialization and deserialization
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isEmbedNode(node)) {
        node.setWidth(width);
        node.setMaxWidth(maxWidth);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const isFocused = isSelected || isResizing;

  // Switch returned components based on embedType
  const createDOMFromEmbedType = () => {
    switch (embedType) {
      case 'twitter': {
        return (
          <>
            <div
              className={isFocused ? 'embed focused' : 'embed'}
              ref={embedRef}
              data-theme='light'
            >
              <Tweet id={source} />
            </div>
            {resizable && $isNodeSelection(selection) && isFocused && (
              <EmbedTwitterResizer
                editor={editor}
                buttonRef={buttonRef}
                embedRef={embedRef}
                onResizeStart={onResizeStart}
                onResizeEnd={onResizeEnd}
                nodeKey={nodeKey}
              />
            )}
          </>
        );
      }
      case 'google-maps': {
        return (
          <>
            <div
              className={isFocused ? 'embed focused' : 'embed'}
              ref={embedRef}
              dangerouslySetInnerHTML={{ __html: source }}
            ></div>
            {resizable && $isNodeSelection(selection) && isFocused && (
              <EmbedMapsResizer
                editor={editor}
                buttonRef={buttonRef}
                embedRef={embedRef}
                onResizeStart={onResizeStart}
                onResizeEnd={onResizeEnd}
                nodeKey={nodeKey}
              />
            )}
          </>
        );
      }
      default: {
        return (
          <>
            <div
              className={isFocused ? 'embed focused' : 'embed'}
              ref={embedRef}
              dangerouslySetInnerHTML={{ __html: source }}
            ></div>
            {resizable && $isNodeSelection(selection) && isFocused && (
              <EmbedResizer
                embedType={embedType}
                editor={editor}
                buttonRef={buttonRef}
                embedRef={embedRef}
                onResizeStart={onResizeStart}
                onResizeEnd={onResizeEnd}
                nodeKey={nodeKey}
              />
            )}
          </>
        );
      }
    }
  };

  return <>{createDOMFromEmbedType()}</>;
}

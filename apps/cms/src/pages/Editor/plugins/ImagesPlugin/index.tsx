import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { useEffect } from 'react';
import { INSERT_IMAGE_COMMAND } from '../../utils/exportedCommands';

import {
  $createImageNode,
  ImageNode,
  ImagePayload,
} from '../../nodes/ImageNode';

import { $createImageBlockNode } from '../../nodes/ImageBlockNode';

export type InsertImagePayload = Readonly<ImagePayload>;

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

const ImagesPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const newImageBlock = $createImageBlockNode();
          $insertNodes([newImageBlock]);

          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);

          // Add new paragraph node below created image
          const newParagraphNode = $createParagraphNode();
          $insertNodes([newParagraphNode]);

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
};

export default ImagesPlugin;

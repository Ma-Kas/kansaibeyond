import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { useEffect } from 'react';

import { INSERT_GALLERY_COMMAND } from '../../utils/exportedCommands';

import { $createGalleryBlockNode } from '../../nodes/GalleryBlockNode';
import {
  $createGalleryContainerNode,
  GalleryContainerNode,
  GalleryImage,
} from '../../nodes/GalleryContainerNode';

export type InsertGalleryImagePayload = GalleryImage[];

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

const ImageGalleryPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GalleryContainerNode])) {
      throw new Error(
        'ImageGalleryPlugin: GalleryContainerNode not registered on editor'
      );
    }

    return mergeRegister(
      editor.registerCommand<InsertGalleryImagePayload>(
        INSERT_GALLERY_COMMAND,
        (payload) => {
          const newGalleryBlock = $createGalleryBlockNode();
          const newGalleryContainer = $createGalleryContainerNode({
            imageList: payload,
            gridType: 'dynamic-type',
          });
          $insertNodes([newGalleryBlock]);

          $insertNodes([newGalleryContainer]);

          // Add new paragraph node below created image gallery
          const newParagraphNode = $createParagraphNode();
          newGalleryBlock.insertAfter(newParagraphNode).selectNext();

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
};

export default ImageGalleryPlugin;

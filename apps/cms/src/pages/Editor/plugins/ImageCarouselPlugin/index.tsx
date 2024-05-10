import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { useEffect } from 'react';

import { INSERT_CAROUSEL_COMMAND } from '../../utils/exportedCommands';

import { $createCarouselBlockNode } from '../../nodes/CarouselBlockNode';
import {
  $createCarouselContainerNode,
  CarouselContainerNode,
  CarouselImage,
} from '../../nodes/CarouselContainerNode';

export type InsertCarouselImagePayload = CarouselImage[];

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

const ImageCarouselPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CarouselContainerNode])) {
      throw new Error(
        'ImageCarouselPlugin: CarouselContainerNode not registered on editor'
      );
    }

    return mergeRegister(
      editor.registerCommand<InsertCarouselImagePayload>(
        INSERT_CAROUSEL_COMMAND,
        (payload) => {
          const newCarouselBlock = $createCarouselBlockNode();
          const newCarouselContainer = $createCarouselContainerNode({
            imageList: payload,
            carouselType: 'slideshow',
          });
          $insertNodes([newCarouselBlock]);

          $insertNodes([newCarouselContainer]);

          // Add new paragraph node below created image carousel
          const newParagraphNode = $createParagraphNode();
          newCarouselBlock.insertAfter(newParagraphNode).selectNext();

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
};

export default ImageCarouselPlugin;

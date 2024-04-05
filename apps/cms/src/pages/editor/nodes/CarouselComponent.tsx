import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  EditorState,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  $isCarouselContainerNode,
  CarouselContainerNode,
  CarouselImage,
  CarouselType,
} from './CarouselContainerNode';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { z } from 'zod';
import { RIGHT_CLICK_IMAGE_COMMAND } from '../utils/exportedCommands';
import { Alignment, CarouselBlockNode } from './CarouselBlockNode';
import CarouselResizer from '../ui/CarouselResizer';
import { CarouselImageObjectPosition } from './CarouselContainerNode';
import EmblaCarousel from '../components/EmblaCarousel/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import '../components/EmblaCarousel/EmblaCarousel.css';

import ContentSettingsModalInner from '../components/ContentSettingsModal/ContentSettingsModalInner';
import {
  TextInput,
  NumberInput,
  Select,
  Slider,
  Text,
  Divider,
  Tabs,
} from '@mantine/core';
import classes from '../components/ContentSettingsModal/ContentSettingsModal.module.css';

type ImageStyleType = {
  objectPosition?: CarouselImageObjectPosition;
  width?: string;
  aspectRatio?: string;
};

const stringSchema = z.string();
const imagePositionSchema = z.union([
  z.literal('center'),
  z.literal('left'),
  z.literal('right'),
  z.literal('top'),
  z.literal('bottom'),
]);

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

export function LazyImage({
  altText,
  className,
  src,
  objectPosition,
  aspectRatio,
}: {
  altText: string;
  className: string | null;
  src: string;
  objectPosition: CarouselImageObjectPosition | null | undefined;
  aspectRatio: string | null | undefined;
  imagesInView: number | null | undefined;
  imageGap: string | null | undefined;
}): JSX.Element {
  useSuspenseImage(src);
  const style: ImageStyleType = {};
  if (objectPosition) {
    style.objectPosition = objectPosition;
  }
  if (aspectRatio) {
    style.aspectRatio = aspectRatio;
  }

  if (style) {
    return (
      <img
        className={className || undefined}
        src={src}
        alt={altText}
        style={style}
        draggable='false'
      />
    );
  } else {
    return (
      <img
        className={className || undefined}
        src={src}
        alt={altText}
        draggable='false'
      />
    );
  }
}

function eventTargetIsCarouselContainer(
  event: MouseEvent,
  ref: React.MutableRefObject<HTMLDivElement | null>
): boolean {
  const targetElement = event.target as HTMLElement;
  const carouselContainerElement = targetElement.closest(
    "[class^='EditorTheme__carouselContainer']"
  );

  if (
    targetElement === ref.current ||
    carouselContainerElement === ref.current
  ) {
    return true;
  }

  return false;
}

function getBlockParentNode(
  editorState: EditorState,
  node: CarouselContainerNode
): CarouselBlockNode {
  const parentNodeKey = node.__parent;
  return editorState.read(
    () => $getNodeByKey(parentNodeKey!) as CarouselBlockNode
  );
}

export function UpdateCarouselDialog({
  activeEditor,
  nodeKey,
  close,
}: {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
  close: () => void;
}): JSX.Element {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(
    () => $getNodeByKey(nodeKey) as CarouselContainerNode
  );
  const [activeTab, setActiveTab] = useState<string | null>('layout');
  const [imageList, setImageList] = useState(node.getImageList());
  const [carouselType, setCarouselType] = useState<CarouselType>(
    node.getCarouselType()
  );
  const [imagesInView, setImagesInView] = useState(node.getImagesInView());
  const [captionText, setCaptionText] = useState(node.getCaptionText());
  const [imageGap, setImageGap] = useState(node.getImageGap());

  // Get the carouselBlock node to set alignment there
  const parentBlockNode = getBlockParentNode(editorState, node);
  const [blockAlignment, setBlockAlignment] = useState<Alignment>(
    parentBlockNode.getAlignment()
  );

  // Edits of whole carousel
  const handleCarouselTypeChange = (select: string | null) => {
    if (select) {
      setCarouselType(select as CarouselType);
    }
  };
  const handleImagesInViewChange = (input: number) => {
    setImagesInView(input);
  };
  const handleImageGapChange = (input: number | string) => {
    setImageGap(input.toString().concat('px'));
  };
  const handleAlignmentChange = (select: string | null) => {
    if (select) {
      setBlockAlignment(select as Alignment);
    }
  };
  const handleAspectRatioChange = (select: string | null) => {
    if (select) {
      const changedImageList = imageList.map((image) => {
        return { ...image, aspectRatio: select };
      });
      setImageList(changedImageList);
    }
  };

  const handleImageChange = (
    image: CarouselImage,
    type: string,
    input: unknown
  ): void => {
    switch (type) {
      case 'altText': {
        const parseResult = stringSchema.safeParse(input);
        if (parseResult.success) {
          const newAltText = parseResult.data;
          image.altText = newAltText;
          const changedImageList = imageList.map((img) =>
            img.id !== image.id ? img : image
          );
          setImageList(changedImageList);
        }
        break;
      }
      case 'position': {
        const parseResult = imagePositionSchema.safeParse(input);
        if (parseResult.success) {
          const newPosition = parseResult.data;
          image.objectPosition = newPosition;
          const changedImageList = imageList.map((img) =>
            img.id !== image.id ? img : image
          );
          setImageList(changedImageList);
        }
        break;
      }
      case 'aspect-ratio': {
        const parseResult = stringSchema.safeParse(input);
        if (parseResult.success) {
          const newAspectRatio = parseResult.data;
          image.aspectRatio = newAspectRatio;
          const changedImageList = imageList.map((img) =>
            img.id !== image.id ? img : image
          );
          setImageList(changedImageList);
        }
        break;
      }
    }
  };

  const handleOnConfirm = () => {
    const payload = {
      captionText,
      imageList,
      imagesInView,
      carouselType,
      imageGap,
    };
    if (node && parentBlockNode) {
      activeEditor.update(() => {
        node.update(payload);
        parentBlockNode.setAlignment(blockAlignment);
      });
    }
    setActiveTab('layout');
    close();
  };

  // Reset changed values and close modal
  const handleOnCancel = () => {
    setImageList(node.getImageList());
    setCarouselType(node.getCarouselType());
    setImagesInView(node.getImagesInView());
    setImageGap(node.getImageGap());
    setCaptionText(node.getCaptionText());
    setBlockAlignment(parentBlockNode.getAlignment());
    setActiveTab('layout');
    close();
  };

  return (
    <ContentSettingsModalInner
      title='Carousel Settings'
      confirm={handleOnConfirm}
      cancel={handleOnCancel}
    >
      <Tabs
        className={classes['content_settings_modal_content_tabs']}
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List
          className={classes['content_settings_modal_content_tabs_list']}
        >
          <Tabs.Tab value='images'>Images</Tabs.Tab>
          <Tabs.Tab value='layout'>Layout</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          className={classes['content_settings_modal_content_tabs_panel']}
          value='layout'
        >
          {/* Whole Carousel Edit */}
          <div
            className={classes['content_settings_modal_content_inner_group']}
          >
            <Select
              label='Carousel Type'
              data={[
                { value: 'slideshow', label: 'Slideshow' },
                { value: 'slider', label: 'Slider' },
              ]}
              value={carouselType}
              onChange={(value, _option) => handleCarouselTypeChange(value)}
              allowDeselect={false}
              withCheckIcon={false}
            />
            <Divider />
            <Select
              label='Carousel Aspect Ratio'
              data={[
                { value: '16 / 9', label: '16:9' },
                { value: '4 / 3', label: '4:3' },
                { value: '1.91 / 3', label: '1.91:1' },
                { value: '1 / 1', label: '1:1' },
                { value: '3 / 4', label: '3:4' },
                { value: '4 / 5', label: '4:5' },
                { value: '9 / 16', label: '9:16' },
              ]}
              value={
                imageList[0].aspectRatio ? imageList[0].aspectRatio : '4 / 3'
              }
              onChange={(value, _option) => handleAspectRatioChange(value)}
              allowDeselect={false}
              withCheckIcon={false}
            />
            {carouselType === 'slider' && (
              <div
                className={
                  classes['content_settings_modal_content_slider_container']
                }
                style={{ marginBottom: '24px' }}
              >
                <Text>Max Images in View</Text>
                <Slider
                  label={null}
                  min={1}
                  max={4}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                  ]}
                  step={1}
                  value={imagesInView ? imagesInView : 1}
                  onChange={handleImagesInViewChange}
                />
              </div>
            )}
            {carouselType === 'slider' && (
              <div
                className={
                  classes['content_settings_modal_content_slider_container']
                }
              >
                <Text>Spacing</Text>
                <div
                  className={
                    classes['content_settings_modal_content_slider_group']
                  }
                >
                  <Slider
                    min={0}
                    max={100}
                    value={imageGap ? Number(imageGap.slice(0, -2)) : 8}
                    onChange={handleImageGapChange}
                  />
                  <NumberInput
                    min={0}
                    max={100}
                    startValue={imageGap ? Number(imageGap.slice(0, -2)) : 8}
                    suffix='px'
                    value={imageGap ? Number(imageGap.slice(0, -2)) : '8'}
                    onChange={handleImageGapChange}
                  />
                </div>
              </div>
            )}
            <Divider />
            <Select
              label='Alignment on Page'
              data={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
              value={blockAlignment}
              onChange={(value, _option) => handleAlignmentChange(value)}
              allowDeselect={false}
              withCheckIcon={false}
            />
            <Divider />
            <TextInput
              label='Caption'
              placeholder='Add a caption here'
              value={captionText}
              onChange={(e) => setCaptionText(e.currentTarget.value)}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          className={classes['content_settings_modal_content_tabs_panel']}
          value='images'
        >
          {/* Individual Image Edits */}
          <div
            className={classes['content_settings_modal_content_inner_group']}
          >
            {imageList.map((image, index) => {
              return (
                <div
                  className={
                    classes['content_settings_modal_content_inner_subgroup']
                  }
                  key={image.id}
                >
                  <Text>{`Image ${index + 1}`}</Text>
                  <TextInput
                    label='Alt Text'
                    placeholder='Descriptive alternative text'
                    value={image.altText}
                    onChange={(e) =>
                      handleImageChange(image, 'altText', e.currentTarget.value)
                    }
                  />
                  <Select
                    label='Image Position within Container'
                    data={[
                      { value: 'center', label: 'Center' },
                      { value: 'left', label: 'Left' },
                      { value: 'right', label: 'Right' },
                      { value: 'top', label: 'Top' },
                      { value: 'bottom', label: 'Bottom' },
                    ]}
                    value={
                      image.objectPosition ? image.objectPosition : 'center'
                    }
                    onChange={(value, _option) =>
                      handleImageChange(image, 'position', value)
                    }
                    allowDeselect={false}
                    withCheckIcon={false}
                  />
                  {carouselType === 'slider' && (
                    <Select
                      label='Image Aspect Ratio'
                      data={[
                        { value: '16 / 9', label: '16:9' },
                        { value: '4 / 3', label: '4:3' },
                        { value: '1.91 / 3', label: '1.91:1' },
                        { value: '1 / 1', label: '1:1' },
                        { value: '3 / 4', label: '3:4' },
                        { value: '4 / 5', label: '4:5' },
                        { value: '9 / 16', label: '9:16' },
                      ]}
                      value={image.aspectRatio ? image.aspectRatio : '1 / 1'}
                      onChange={(value, _option) =>
                        handleImageChange(image, 'aspect-ratio', value)
                      }
                      allowDeselect={false}
                      withCheckIcon={false}
                    />
                  )}
                  {index < imageList.length - 1 && <Divider />}
                </div>
              );
            })}
          </div>
        </Tabs.Panel>
      </Tabs>
    </ContentSettingsModalInner>
  );
}

export default function CarouselComponent({
  imageList,
  carouselType,
  imagesInView,
  nodeKey,
  captionText,
  resizable,
  imageGap,
}: {
  imageList: CarouselImage[];
  carouselType: CarouselType;
  imagesInView?: number | null | undefined;
  width?: string | null | undefined;
  maxWidth?: string | null | undefined;
  imageGap?: string | null | undefined;
  nodeKey: NodeKey;
  captionText?: string;
  resizable: boolean;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<null | HTMLDivElement>(
    editor.getElementByKey(nodeKey) as HTMLDivElement
  );
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isCarouselContainerNode(node)) {
          // Access the parent/grandparent imageBlockNode that contains this image
          const domElement = editor.getElementByKey(nodeKey);
          if (!domElement) {
            return false;
          }
          const parentBlock = domElement.closest(
            "[class^='EditorTheme__carouselBlock']"
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

          // Delete parent ImageBlockNode instead of just the image, to avoid having
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

      if (eventTargetIsCarouselContainer(event, containerRef)) {
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

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection();
        const domElement = event.target as HTMLElement;
        if (
          domElement.tagName === 'IMG' &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event);
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    let isMounted = true;
    const rootElement = editor.getRootElement();
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
      editor.registerCommand<MouseEvent>(
        RIGHT_CLICK_IMAGE_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (eventTargetIsCarouselContainer(event, containerRef)) {
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

    rootElement?.addEventListener('contextmenu', onRightClick);

    return () => {
      isMounted = false;
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
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
    onRightClick,
    setSelected,
  ]);

  const onResizeEnd = (width: string, maxWidth: string) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    // Set values in ImageNode that will be necessary for serialization and deserialization
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isCarouselContainerNode(node)) {
        node.setWidth(width);
        node.setMaxWidth(maxWidth);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const CAROUSEL_OPTIONS: EmblaOptionsType = {};

  const isFocused = isSelected || isResizing;
  return (
    <Suspense fallback={null}>
      <div
        className={
          isFocused
            ? `carousel-container ${carouselType} focused`
            : `carousel-container ${carouselType}`
        }
        draggable='false'
      >
        <EmblaCarousel
          carouselType={carouselType}
          imagesInView={imagesInView}
          imageGap={imageGap}
          slides={imageList}
          options={CAROUSEL_OPTIONS}
        />
      </div>
      {resizable && $isNodeSelection(selection) && isFocused && (
        <CarouselResizer
          editor={editor}
          buttonRef={buttonRef}
          containerRef={containerRef}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
          nodeKey={nodeKey}
        />
      )}
      {captionText && (
        <div className='carousel-caption-container'>{captionText}</div>
      )}
    </Suspense>
  );
}

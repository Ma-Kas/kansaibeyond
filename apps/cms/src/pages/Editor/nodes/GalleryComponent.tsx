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
  $isGalleryContainerNode,
  GalleryContainerNode,
  GalleryImage,
  GridType,
} from './GalleryContainerNode';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { z } from 'zod';
import { RIGHT_CLICK_IMAGE_COMMAND } from '../utils/exportedCommands';
import GalleryResizer from '../ui/GalleryResizer';
import { Alignment, GalleryBlockNode } from './GalleryBlockNode';

import { GalleryImageObjectPosition } from './GalleryContainerNode';
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
import cx from 'clsx';
import { ASPECT_RATIO_DATA } from '../../../utils/editor-constants';
import classes from '../components/ContentSettingsModal/ContentSettingsModal.module.css';

const GALLERY_TYPE_DATA = [
  {
    label: 'Dynamic Column Generation',
    value: 'dynamic-type',
    icon: () => {
      return (
        <>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='50'
            height='50'
            fill='currentColor'
            viewBox='0 0 50 50'
          >
            <path d='M 3 2 h 20 a 1 1 0 0 1 1 1 v 20 a 1 1 0 0 1 -1 1 H 3 a 1 1 0 0 1 -1 -1 V 3 a 1 1 0 0 1 1 -1 z m 0 1 v 20 h 20 V 3 H 3 z m 24 -1 h 20 a 1 1 0 0 1 1 1 v 20 a 1 1 0 0 1 -1 1 H 27 a 1 1 0 0 1 -1 -1 V 3 a 1 1 0 0 1 1 -1 z m 0 1 v 20 h 20 V 3 H 27 z M 3 26 h 20 a 1 1 0 0 1 1 1 v 20 a 1 1 0 0 1 -1 1 H 3 a 1 1 0 0 1 -1 -1 V 27 a 1 1 0 0 1 1 -1 z m 0 1 v 20 h 20 V 27 H 3 z z v 20 z' />
          </svg>
        </>
      );
    },
  },
  {
    label: 'Fixed Column Number',
    value: 'static-type',
    icon: () => {
      return (
        <>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='50'
            height='50'
            fill='currentColor'
            fillRule='evenodd'
            viewBox='0 0 50 50'
          >
            <path d='M3 2h11a1 1 0 0 1 1 1v44a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v44h11V3H3zm15-1h14a1 1 0 0 1 1 1v44a1 1 0 0 1-1 1H18a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v44h14V3H18zm18-1h11a1 1 0 0 1 1 1v44a1 1 0 0 1-1 1H36a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v44h11V3H36z' />
          </svg>
        </>
      );
    },
  },
  {
    label: 'Stretch Last Image Across',
    value: 'flex-type',
    icon: () => {
      return (
        <>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='50'
            height='50'
            fill='currentColor'
            viewBox='0 0 50 50'
            transform='scale (1, -1)'
          >
            <path d='M 3 2 h 44 a 1 1 90 0 1 1 1 v 31 a 1 1 90 0 1 -1 1 H 3 a 1 1 90 0 1 -1 -1 V 3 a 1 1 90 0 1 1 -1 z m 0 1 v 31 h 44 V 3 H 3 z m 0 34 h 12 a 1 1 90 0 1 1 1 v 9 a 1 1 90 0 1 -1 1 H 3 a 1 1 90 0 1 -1 -1 v -9 a 1 1 90 0 1 1 -1 z m 0 1 v 9 h 12 v -9 H 3 z m 16 -1 h 12 a 1 1 90 0 1 1 1 v 9 a 1 1 90 0 1 -1 1 H 19 a 1 1 90 0 1 -1 -1 v -9 a 1 1 90 0 1 1 -1 z m 0 1 v 9 h 12 v -9 H 19 z m 16 -1 h 12 a 1 1 90 0 1 1 1 v 9 a 1 1 90 0 1 -1 1 H 35 a 1 1 90 0 1 -1 -1 v -9 a 1 1 90 0 1 1 -1 z m 0 1 v 9 h 12 v -9 H 35 z z z' />
          </svg>
        </>
      );
    },
  },
];

type ImageStyleType = {
  objectPosition?: GalleryImageObjectPosition;
  width?: string;
  aspectRatio?: string;
};

type GalleryInlineStyleType = {
  gap?: string | undefined;
  gridTemplateColumns?: string | undefined;
};

const stringSchema = z.string();
const numberSchema = z.number();
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

function LazyImage({
  altText,
  className,
  src,
  objectPosition,
  imageWidth,
  aspectRatio,
}: {
  altText: string;
  className: string | null;
  src: string;
  objectPosition: GalleryImageObjectPosition | null | undefined;
  imageWidth: string | null | undefined;
  aspectRatio: string | null | undefined;
}): JSX.Element {
  useSuspenseImage(src);
  const style: ImageStyleType = {};
  if (objectPosition) {
    style.objectPosition = objectPosition;
  }
  if (imageWidth) {
    style.width = imageWidth;
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

function eventTargetIsGalleryContainer(
  event: MouseEvent,
  ref: React.MutableRefObject<HTMLDivElement | null>
): boolean {
  const targetElement = event.target as HTMLElement;
  const galleryContainerElement = targetElement.closest(
    "[class^='EditorTheme__galleryContainer']"
  );

  if (
    targetElement === ref.current ||
    galleryContainerElement === ref.current
  ) {
    return true;
  }

  return false;
}

function getBlockParentNode(
  editorState: EditorState,
  node: GalleryContainerNode
): GalleryBlockNode {
  const parentNodeKey = node.__parent;
  return editorState.read(
    () => $getNodeByKey(parentNodeKey!) as GalleryBlockNode
  );
}

export function UpdateGalleryDialog({
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
    () => $getNodeByKey(nodeKey) as GalleryContainerNode
  );
  const [activeTab, setActiveTab] = useState<string | null>('layout');
  const [imageList, setImageList] = useState(node.getImageList());
  const [gridType, setGridType] = useState<GridType>(node.getGridType());
  const [columns, setColumns] = useState(node.getColumns());
  const [captionText, setCaptionText] = useState(node.getCaptionText());
  const [gridGap, setGridGap] = useState(node.getGridGap());
  const [columnMinWidth, setColumnMinWidth] = useState(
    node.getColumnMinWidth()
  );

  // Get the galleryBlock node to set alignment there
  const parentBlockNode = getBlockParentNode(editorState, node);
  const [blockAlignment, setBlockAlignment] = useState<Alignment>(
    parentBlockNode.getAlignment()
  );

  // Edits of whole gallery
  const handleGridTypeChange = (select: string | null) => {
    if (select) {
      setGridType(select as GridType);
    }
  };
  const handleColumnsChange = (select: number) => {
    if (select) {
      setColumns(select);
    }
  };
  const handleGridGapChange = (input: number | string) => {
    setGridGap(input.toString().concat('px'));
  };
  const handleColumnMinWidthChange = (input: number | string | null) => {
    if (input) {
      setColumnMinWidth(Number(input));
    }
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
    image: GalleryImage,
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
      case 'width': {
        const parseResult = numberSchema.safeParse(input);
        if (parseResult.success) {
          const newWidth = `${parseResult.data}%`;
          image.imageWidth = newWidth;
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
      columns,
      gridType,
      gridGap,
      columnMinWidth,
    };
    if (node && parentBlockNode) {
      activeEditor.update(() => {
        node.update(payload);
        parentBlockNode.setAlignment(blockAlignment);
      });
    }
    close();
    setActiveTab('layout');
  };

  // Reset changed values and close modal
  const handleOnCancel = () => {
    setImageList(node.getImageList());
    setGridType(node.getGridType());
    setColumns(node.getColumns());
    setGridGap(node.getGridGap());
    setColumnMinWidth(node.getColumnMinWidth());
    setCaptionText(node.getCaptionText());
    setBlockAlignment(parentBlockNode.getAlignment());
    setActiveTab('layout');
    close();
  };

  return (
    <ContentSettingsModalInner
      title='Gallery Settings'
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
          {/* Whole Gallery Edit */}
          <div
            className={classes['content_settings_modal_content_inner_group']}
          >
            {/* Gallery Type Pick */}
            <div
              className={
                classes['content_settings_modal_content_pick_container']
              }
            >
              <Text>Choose Gallery Layout</Text>
              <div
                className={
                  classes[
                    'content_settings_modal_content_pick_container_group_type'
                  ]
                }
              >
                {GALLERY_TYPE_DATA.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      type='button'
                      key={type.label}
                      onClick={() => handleGridTypeChange(type.value)}
                      className={
                        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                        cx(
                          classes[
                            'content_settings_modal_content_pick_container_button'
                          ],
                          {
                            [classes.active]: gridType === type.value,
                          }
                        )
                      }
                    >
                      <Icon />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Divider />
            {/* Aspect Ratio Pick */}
            <div
              className={
                classes['content_settings_modal_content_pick_container']
              }
            >
              <Text>Global Image Aspect Ratio</Text>
              <div
                className={
                  classes['content_settings_modal_content_pick_container_group']
                }
              >
                {ASPECT_RATIO_DATA.map((item) => {
                  return (
                    <button
                      type='button'
                      key={item.label}
                      onClick={() => handleAspectRatioChange(item.value)}
                      className={
                        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                        cx(
                          classes[
                            'content_settings_modal_content_pick_container_button'
                          ],
                          {
                            [classes.active]: imageList[0].aspectRatio
                              ? imageList[0].aspectRatio === item.value
                              : '1 / 1' === item.value,
                          }
                        )
                      }
                    >
                      <div
                        className={classes['aspect_ratio_symbol']}
                        style={{ aspectRatio: `${item.value}` }}
                      ></div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {gridType === 'static-type' && (
              <div
                className={
                  classes['content_settings_modal_content_slider_container']
                }
                style={{ marginBottom: '24px' }}
              >
                <Text>Images per Row</Text>
                <Slider
                  label={null}
                  min={1}
                  max={6}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                    { value: 6, label: '6' },
                  ]}
                  step={1}
                  value={columns ? columns : 3}
                  onChange={handleColumnsChange}
                />
              </div>
            )}
            <div
              className={
                classes['content_settings_modal_content_slider_container']
              }
            >
              <Text>Minimum Image Width</Text>
              <div
                className={
                  classes['content_settings_modal_content_slider_group']
                }
              >
                <Slider
                  label={null}
                  min={100}
                  max={300}
                  value={columnMinWidth ? columnMinWidth : 150}
                  onChange={handleColumnMinWidthChange}
                />
                <NumberInput
                  min={100}
                  max={300}
                  startValue={columnMinWidth ? columnMinWidth : 150}
                  suffix='px'
                  value={columnMinWidth ? columnMinWidth : 150}
                  onChange={handleColumnMinWidthChange}
                />
              </div>
            </div>
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
                  value={gridGap ? Number(gridGap.slice(0, -2)) : 8}
                  onChange={handleGridGapChange}
                />
                <NumberInput
                  min={0}
                  max={100}
                  startValue={gridGap ? Number(gridGap.slice(0, -2)) : 8}
                  suffix='px'
                  value={gridGap ? Number(gridGap.slice(0, -2)) : '8'}
                  onChange={handleGridGapChange}
                />
              </div>
            </div>
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
                  <div
                    className={
                      classes['content_settings_modal_content_pick_container']
                    }
                  >
                    <Text>Image Aspect Ratio</Text>
                    <div
                      className={
                        classes[
                          'content_settings_modal_content_pick_container_group'
                        ]
                      }
                    >
                      {ASPECT_RATIO_DATA.map((item) => {
                        return (
                          <button
                            type='button'
                            key={item.label}
                            onClick={() =>
                              handleImageChange(
                                image,
                                'aspect-ratio',
                                item.value
                              )
                            }
                            className={
                              // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                              cx(
                                classes[
                                  'content_settings_modal_content_pick_container_button'
                                ],
                                {
                                  [classes.active]: image.aspectRatio
                                    ? image.aspectRatio === item.value
                                    : '1 / 1' === item.value,
                                }
                              )
                            }
                          >
                            <div
                              className={classes['aspect_ratio_symbol']}
                              style={{ aspectRatio: `${item.value}` }}
                            ></div>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    className={
                      classes['content_settings_modal_content_slider_container']
                    }
                  >
                    <Text>Image Width within Container</Text>
                    <div
                      className={
                        classes['content_settings_modal_content_slider_group']
                      }
                    >
                      <Slider
                        label={null}
                        min={1}
                        max={100}
                        value={
                          image.imageWidth
                            ? Number(image.imageWidth.slice(0, -1))
                            : 100
                        }
                        onChange={(value) =>
                          handleImageChange(image, 'width', value)
                        }
                      />
                      <NumberInput
                        min={1}
                        max={100}
                        startValue={
                          image.imageWidth
                            ? Number(image.imageWidth.slice(0, -1))
                            : 100
                        }
                        suffix='%'
                        value={
                          image.imageWidth
                            ? Number(image.imageWidth.slice(0, -1))
                            : 100
                        }
                        onChange={(value) =>
                          handleImageChange(image, 'width', value)
                        }
                      />
                    </div>
                  </div>

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

export default function GalleryComponent({
  imageList,
  gridType,
  columns,
  nodeKey,
  captionText,
  resizable,
  gridGap,
  columnMinWidth,
}: {
  imageList: GalleryImage[];
  gridType: GridType;
  columns?: number | null | undefined;
  width?: string | null | undefined;
  maxWidth?: string | null | undefined;
  gridGap?: string | null | undefined;
  columnMinWidth?: number | null | undefined;
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
        if ($isGalleryContainerNode(node)) {
          // Access the parent/grandparent imageBlockNode that contains this image
          const domElement = editor.getElementByKey(nodeKey);
          if (!domElement) {
            return false;
          }
          const parentBlock = domElement.closest(
            "[class^='EditorTheme__galleryBlock']"
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

      if (eventTargetIsGalleryContainer(event, containerRef)) {
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
          if (eventTargetIsGalleryContainer(event, containerRef)) {
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
      if ($isGalleryContainerNode(node)) {
        node.setWidth(width);
        node.setMaxWidth(maxWidth);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  // If user has overriden stylesheet with inline properties, set them here
  // to apply to component
  const setInlineStyleOverride = (): GalleryInlineStyleType => {
    const style: GalleryInlineStyleType = {};
    if (gridGap) {
      style.gap = gridGap;
    }
    if (gridType && (columnMinWidth || columns)) {
      switch (gridType) {
        case 'dynamic-type': {
          style.gridTemplateColumns = `repeat(auto-fit, minmax(${columnMinWidth}px, 1fr))`;
          break;
        }
        case 'static-type': {
          style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
          break;
        }
        case 'flex-type': {
          break;
        }
      }
    }

    return style;
  };

  const containerInlineStyle = setInlineStyleOverride();

  const isFocused = isSelected || isResizing;
  return (
    <Suspense fallback={null}>
      <div
        style={containerInlineStyle}
        className={
          isFocused
            ? `grid-container ${gridType} focused`
            : `grid-container ${gridType}`
        }
        draggable='false'
      >
        {imageList.map((image) => {
          return (
            <LazyImage
              key={image.id}
              className='gallery-image'
              src={image.src}
              altText={image.altText}
              objectPosition={image.objectPosition}
              imageWidth={image.imageWidth}
              aspectRatio={image.aspectRatio}
            />
          );
        })}
      </div>
      {resizable && $isNodeSelection(selection) && isFocused && (
        <GalleryResizer
          editor={editor}
          buttonRef={buttonRef}
          containerRef={containerRef}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
          nodeKey={nodeKey}
        />
      )}
      {captionText && (
        <div className='gallery-caption-container'>{captionText}</div>
      )}
    </Suspense>
  );
}

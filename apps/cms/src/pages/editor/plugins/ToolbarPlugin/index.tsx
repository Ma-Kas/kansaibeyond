import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  BaseSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useState } from 'react';

// Lexical Plugins Imports
import {
  blockTypeToBlockName,
  FONT_FAMILY_OPTIONS,
  ELEMENT_FORMAT_OPTIONS,
} from '../../../../utils/editor-constants';
import useModal from '../../hooks/useModal';
import { $createStickyNode } from '../../nodes/StickyNode';
import BlockTypeList, { BlockTypeListItem } from '../../ui/BlockTypeList';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import DropdownColorPicker from '../../ui/DropdownColorPicker';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
import { InsertImageDialog } from '../ImagesPlugin';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
import { InsertTableDialog } from '../TablePlugin';
import FontSizeDropdown from './fontSize';
import { InsertGalleryContainerDialog } from '../ImageGalleryPlugin';
import { InsertEmbedDialog } from '../EmbedPlugin';
import { InsertCarouselContainerDialog } from '../ImageCarouselPlugin';

// Mantine Components Imports
import { ActionIcon, Group } from '@mantine/core';
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconItalic,
  IconUnderline,
  IconCode,
  IconLink,
  IconStrikethrough,
  IconSuperscript,
  IconSubscript,
  IconClearFormatting,
} from '@tabler/icons-react';
import cx from 'clsx';
import ToolbarDropdown from '../../components/ToolbarDropdown/ToolbarDropdown';

// Style Imports
import classes from './Toolbar.module.css';

const IMPORT_TEST = '';

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

// To disallow reformat certain nodes (imageBlock, galleryBlock, imageNode)
// as code block, list etc, as attempting to do so would crash
function containsUnformattableNodes(selection: BaseSelection): boolean {
  const nodes = selection.getNodes();
  if (!nodes) {
    return true;
  }
  for (let i = 0; i < nodes.length; i++) {
    if (
      nodes[i].__type === 'image-block' ||
      nodes[i].__type === 'image' ||
      nodes[i].__type === 'gallery-block' ||
      nodes[i].__type === 'gallery-container' ||
      nodes[i].__type === 'carousel-block' ||
      nodes[i].__type === 'carousel-container' ||
      nodes[i].__type === 'embed-block' ||
      nodes[i].__type === 'embed'
    ) {
      return true;
    }
  }
  return false;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
}

function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection || containsUnformattableNodes(selection)) {
        return;
      }
      if (blockType !== 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    });
  };

  const formatNumberedList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection || containsUnformattableNodes(selection)) {
        return;
      }
      if (blockType !== 'number') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    });
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null && !containsUnformattableNodes(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  const dropDownItems = [
    {
      text: 'Paragraph',
      onClick: () => formatParagraph(),
    },
    {
      text: 'Heading 1',
      onClick: () => formatHeading('h1'),
    },
    {
      text: 'Heading 2',
      onClick: () => formatHeading('h2'),
    },
    {
      text: 'Heading 3',
      onClick: () => formatHeading('h3'),
    },
    {
      text: 'Bulleted List',
      onClick: () => formatBulletList(),
    },
    {
      text: 'Numbered List',
      onClick: () => formatNumberedList(),
    },
    {
      text: 'Quote',
      onClick: () => formatQuote(),
    },
    {
      text: 'Code Block',
      onClick: () => formatCode(),
    },
  ];

  return (
    <ToolbarDropdown
      type='block-format'
      currentValue={blockTypeToBlockName[blockType]}
      ariaLabel='Formatting options for text style'
      items={dropDownItems}
      disabled={disabled}
    />
  );
}

function BlockTypeListMenu({
  editor,
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection || containsUnformattableNodes(selection)) {
        return;
      }
      if (blockType !== 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    });
  };

  const formatNumberedList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection || containsUnformattableNodes(selection)) {
        return;
      }
      if (blockType !== 'number') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    });
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null && !containsUnformattableNodes(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  return (
    <BlockTypeList editor={editor}>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={formatParagraph}
      >
        <i className='icon paragraph' />
        <span className='text'>Paragraph</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'h1')}
        onClick={() => formatHeading('h1')}
      >
        <i className='icon h1' />
        <span className='text'>Heading 1</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'h2')}
        onClick={() => formatHeading('h2')}
      >
        <i className='icon h2' />
        <span className='text'>Heading 2</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'h3')}
        onClick={() => formatHeading('h3')}
      >
        <i className='icon h3' />
        <span className='text'>Heading 3</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={formatBulletList}
      >
        <i className='icon bullet-list' />
        <span className='text'>Bullet List</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'number')}
        onClick={formatNumberedList}
      >
        <i className='icon numbered-list' />
        <span className='text'>Numbered List</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={formatQuote}
      >
        <i className='icon quote' />
        <span className='text'>Quote</span>
      </BlockTypeListItem>
      <BlockTypeListItem
        className={'item ' + dropDownActiveClass(blockType === 'code')}
        onClick={formatCode}
      >
        <i className='icon code' />
        <span className='text'>Code Block</span>
      </BlockTypeListItem>
    </BlockTypeList>
  );
}

function FontDropDown({
  editor,
  currentValue,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  currentValue: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const fontFamilyDropDownItems = FONT_FAMILY_OPTIONS.map(([option, text]) => ({
    text: text,
    onClick: () => handleClick(option),
  }));

  return (
    <ToolbarDropdown
      type='font-family'
      currentValue={currentValue}
      ariaLabel='Formatting options for font family'
      items={fontFamilyDropDownItems}
      disabled={disabled}
    />
  );
}

function TextFormatDropdown({
  editor,
  disabled = false,
  isStrikethrough,
  isSuperscript,
  isSubscript,
  isCode,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
  isStrikethrough: boolean;
  isSuperscript: boolean;
  isSubscript: boolean;
  isCode: boolean;
}): JSX.Element {
  const textFormatDropDownItems = [
    {
      text: 'Code',
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      },
      icon: IconCode,
      activeFormat: isCode,
    },
    {
      text: 'Strikethrough',
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      },
      icon: IconStrikethrough,
      activeFormat: isStrikethrough,
    },
    {
      text: 'Superscript',
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      },
      icon: IconSuperscript,
      activeFormat: isSuperscript,
    },
    {
      text: 'Subscript',
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      },
      icon: IconSubscript,
      activeFormat: isSubscript,
    },
  ];

  return (
    <ToolbarDropdown
      type='text-format'
      currentValue={''}
      ariaLabel='Formatting options for additional text styles'
      items={textFormatDropDownItems}
      disabled={disabled}
    />

    // <DropDown
    //           disabled={!isEditable}
    //           buttonClassName='toolbar-item spaced'
    //           buttonLabel=''
    //           buttonAriaLabel='Formatting options for additional text styles'
    //           buttonIconClassName='icon format-more'
    //         >
    //           <DropDownItem
    //             onClick={() => {
    //               activeEditor.dispatchCommand(
    //                 FORMAT_TEXT_COMMAND,
    //                 'strikethrough'
    //               );
    //             }}
    //             className={'item ' + dropDownActiveClass(isStrikethrough)}
    //             title='Strikethrough'
    //             aria-label='Format text with a strikethrough'
    //           >
    //             <i className='icon strikethrough' />
    //             <span className='text'>Strikethrough</span>
    //           </DropDownItem>
    //           <DropDownItem
    //             onClick={() => {
    //               activeEditor.dispatchCommand(
    //                 FORMAT_TEXT_COMMAND,
    //                 'subscript'
    //               );
    //             }}
    //             className={'item ' + dropDownActiveClass(isSubscript)}
    //             title='Subscript'
    //             aria-label='Format text with a subscript'
    //           >
    //             <i className='icon subscript' />
    //             <span className='text'>Subscript</span>
    //           </DropDownItem>
    //           <DropDownItem
    //             onClick={() => {
    //               activeEditor.dispatchCommand(
    //                 FORMAT_TEXT_COMMAND,
    //                 'superscript'
    //               );
    //             }}
    //             className={'item ' + dropDownActiveClass(isSuperscript)}
    //             title='Superscript'
    //             aria-label='Format text with a superscript'
    //           >
    //             <i className='icon superscript' />
    //             <span className='text'>Superscript</span>
    //           </DropDownItem>
    //           <DropDownItem
    //             onClick={clearFormatting}
    //             className='item'
    //             title='Clear text formatting'
    //             aria-label='Clear all text formatting'
    //           >
    //             <i className='icon clear' />
    //             <span className='text'>Clear Formatting</span>
    //           </DropDownItem>
    //         </DropDown>
  );
}

function ElementFormatDropdown({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

  return (
    <DropDown
      disabled={disabled}
      // Uncomment to show label of current formatting option
      // buttonLabel={formatOption.name}
      buttonIconClassName={`icon ${
        isRTL ? formatOption.iconRTL : formatOption.icon
      }`}
      buttonClassName='toolbar-item spaced alignment'
      buttonAriaLabel='Formatting options for text alignment'
    >
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className='item'
      >
        <i className='icon left-align' />
        <span className='text'>Left Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className='item'
      >
        <i className='icon center-align' />
        <span className='text'>Center Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className='item'
      >
        <i className='icon right-align' />
        <span className='text'>Right Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className='item'
      >
        <i className='icon justify-align' />
        <span className='text'>Justify Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
        }}
        className='item'
      >
        <i
          className={`icon ${
            isRTL
              ? ELEMENT_FORMAT_OPTIONS.start.iconRTL
              : ELEMENT_FORMAT_OPTIONS.start.icon
          }`}
        />
        <span className='text'>Start Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
        }}
        className='item'
      >
        <i
          className={`icon ${
            isRTL
              ? ELEMENT_FORMAT_OPTIONS.end.iconRTL
              : ELEMENT_FORMAT_OPTIONS.end.icon
          }`}
        />
        <span className='text'>End Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className='item'
      >
        <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
        <span className='text'>Outdent</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className='item'
      >
        <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
        <span className='text'>Indent</span>
      </DropDownItem>
    </DropDown>
  );
}

function ToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>('18px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode() as ElementNode;
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent() as ElementNode;
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow() as ElementNode;
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Get default block font size from css to pass to toolbar display
      let blockDefaultFontSize = '18px';
      if (elementDOM) {
        blockDefaultFontSize = getComputedStyle(elementDOM).fontSize;
      }

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent() as ElementNode;
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<Omit<ListNode, 'check'>>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          if (type !== 'check') {
            setBlockType(type);
          }
        } else {
          const type =
            element && $isHeadingNode(element)
              ? element.getTag()
              : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(
          selection,
          'font-size',
          blockDefaultFontSize
        )
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff'
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left'
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
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
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {}
      );
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  const handleExportTest = useCallback(() => {
    editor.update(() => {
      const json = editor.getEditorState().toJSON();
      console.log(json);
      // console.log(JSON.stringify(json));
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
    <div className='editor_toolbar'>
      <div className='editor_toolbar_inner'>
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
        {blockType in blockTypeToBlockName && activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={blockType}
              rootType={rootType}
              editor={editor}
            />
          </>
        )}
        {blockType === 'code' ? (
          // Code Language Dropdown
          <DropDown
            disabled={!isEditable}
            buttonClassName='toolbar-item code-language'
            buttonLabel={getLanguageFriendlyName(codeLanguage)}
            buttonAriaLabel='Select language'
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`item ${dropDownActiveClass(
                    value === codeLanguage
                  )}`}
                  onClick={() => onCodeLanguageSelect(value)}
                  key={value}
                >
                  <span className='text'>{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
        ) : (
          <>
            <FontDropDown
              disabled={!isEditable}
              style={'font-family'}
              currentValue={fontFamily}
              editor={editor}
            />
            <FontSizeDropdown
              selectionFontSize={fontSize.slice(0, -2)}
              editor={editor}
              disabled={!isEditable}
            />

            {/* TEXT FORMAT ACTION BUTTONS */}
            <Group gap={0}>
              <ActionIcon
                variant='transparent'
                className={
                  // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                  cx(classes['plain-button'], {
                    [classes.active]: isBold,
                  })
                }
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                title='Bold (Ctrl+B)'
                aria-label='Format text as bold.'
              >
                <IconBold className={classes['action-button']} />
              </ActionIcon>
              <ActionIcon
                variant='transparent'
                className={
                  // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                  cx(classes['plain-button'], {
                    [classes.active]: isItalic,
                  })
                }
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                title='Italic (Ctrl+I)'
                aria-label='Format text as italics.'
              >
                <IconItalic className={classes['action-button']} />
              </ActionIcon>
              <ActionIcon
                variant='transparent'
                className={
                  // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                  cx(classes['plain-button'], {
                    [classes.active]: isUnderline,
                  })
                }
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'underline'
                  );
                }}
                title='Underline (Ctrl+U)'
                aria-label='Format text to underlined.'
              >
                <IconUnderline className={classes['action-button']} />
              </ActionIcon>
              <ActionIcon
                variant='transparent'
                className={
                  // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                  cx(classes['plain-button'], {
                    [classes.active]: isLink,
                  })
                }
                disabled={!isEditable}
                onClick={insertLink}
                title='Insert link'
                aria-label='Insert link'
              >
                <IconLink className={classes['action-button']} />
              </ActionIcon>
              <ActionIcon
                variant='transparent'
                className={classes['plain-button']}
                disabled={!isEditable}
                onClick={clearFormatting}
                title='Clear Formatting'
                aria-label='Clear formatting'
              >
                <IconClearFormatting className={classes['action-button']} />
              </ActionIcon>
            </Group>
            <TextFormatDropdown
              disabled={!isEditable}
              editor={activeEditor}
              isStrikethrough={isStrikethrough}
              isSuperscript={isSuperscript}
              isSubscript={isSubscript}
              isCode={isCode}
            />
            <DropdownColorPicker
              disabled={!isEditable}
              buttonClassName='toolbar-item color-picker'
              buttonAriaLabel='Formatting text color'
              buttonIconClassName='icon font-color'
              color={fontColor}
              onChange={onFontColorSelect}
              title='text color'
            />
            <DropdownColorPicker
              disabled={!isEditable}
              buttonClassName='toolbar-item color-picker'
              buttonAriaLabel='Formatting background color'
              buttonIconClassName='icon bg-color'
              color={bgColor}
              onChange={onBgColorSelect}
              title='bg color'
            />
            <ElementFormatDropdown
              disabled={!isEditable}
              value={elementFormat}
              editor={editor}
              isRTL={isRTL}
            />
            {/* Insert Options Dropdown */}
            <DropDown
              disabled={!isEditable}
              buttonClassName='toolbar-item spaced'
              // Uncomment to show Text on wide editor view
              // buttonLabel='Insert'
              buttonAriaLabel='Insert specialized editor node'
              buttonIconClassName='icon plus'
            >
              <DropDownItem
                onClick={() => {
                  activeEditor.dispatchCommand(
                    INSERT_HORIZONTAL_RULE_COMMAND,
                    undefined
                  );
                }}
                className='item'
              >
                <i className='icon horizontal-rule' />
                <span className='text'>Divider</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  showModal('Insert Image', (onClose) => (
                    <InsertImageDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className='item'
              >
                <i className='icon image' />
                <span className='text'>Image</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  showModal('Insert Image Gallery', (onClose) => (
                    <InsertGalleryContainerDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className='item'
              >
                <i className='icon gallery' />
                <span className='text'>Image Gallery</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  showModal('Insert Image Carousel', (onClose) => (
                    <InsertCarouselContainerDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className='item'
              >
                <i className='icon carousel' />
                <span className='text'>Image Carousel</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  showModal('Embed Content', (onClose) => (
                    <InsertEmbedDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className='item'
              >
                <i className='icon embed' />
                <span className='text'>Embed Content</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  showModal('Insert Table', (onClose) => (
                    <InsertTableDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className='item'
              >
                <i className='icon table' />
                <span className='text'>Table</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  showModal('Insert Columns Layout', (onClose) => (
                    <InsertLayoutDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className='item'
              >
                <i className='icon columns' />
                <span className='text'>Columns Layout</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  editor.update(() => {
                    const root = $getRoot();
                    const stickyNode = $createStickyNode(0, 0);
                    root.append(stickyNode);
                  });
                }}
                className='item'
              >
                <i className='icon sticky' />
                <span className='text'>Sticky Note</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
                }}
                className='item'
              >
                <i className='icon list-expandable' />
                <span className='text'>Expandable List</span>
              </DropDownItem>
            </DropDown>
          </>
        )}
        <button
          className='toolbar-item'
          onClick={() => handleImportTest(IMPORT_TEST)}
          title='Test Import'
          aria-label='Test Import'
        >
          <i className='format import' />
        </button>
        <button
          className='toolbar-item'
          onClick={handleExportTest}
          title='Test Export'
          aria-label='Test Export'
        >
          <i className='format export' />
        </button>
        {modal}
      </div>
    </div>
  );
}

export default ToolbarPlugin;
export { BlockTypeListMenu };

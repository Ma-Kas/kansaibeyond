import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
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
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
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
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  BaseSelection,
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
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useState } from 'react';

// Lexical Plugins Imports
import {
  blockTypeToBlockName,
  FONT_FAMILY_OPTIONS,
  ELEMENT_FORMAT_OPTIONS,
} from '../../../../utils/editor-constants';
import ColorPickerDropdown from '../../components/ColorPickerDropdown/ColorPickerDropdown';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import FontSizeDropdown from './fontSize';

// Mantine Components Imports
import { ActionIcon, Group } from '@mantine/core';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconCode,
  IconLink,
  IconStrikethrough,
  IconSuperscript,
  IconSubscript,
  IconClearFormatting,
  IconAlignLeft,
  IconAlignRight,
  IconAlignCenter,
  IconAlignJustified,
  IconIndentIncrease,
  IconIndentDecrease,
} from '@tabler/icons-react';
import cx from 'clsx';
import ToolbarDropdown from '../../components/ToolbarDropdown/ToolbarDropdown';

// Style Imports
import classes from './Toolbar.module.css';

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

function CodeLanguageDropDown({
  currentValue,
  disabled = false,
  onCodeLanguageSelect,
}: {
  editor: LexicalEditor;
  currentValue: string;
  onCodeLanguageSelect: (value: string) => void;
  disabled?: boolean;
}): JSX.Element {
  const codeLanguageDropDownItems = CODE_LANGUAGE_OPTIONS.map(
    ([value, name]) => ({
      text: name,
      codeValue: value,
      onClick: () => onCodeLanguageSelect(value),
    })
  );

  return (
    <ToolbarDropdown
      type='code-language'
      currentValue={currentValue}
      ariaLabel='Select language'
      items={codeLanguageDropDownItems}
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
  );
}

function ElementFormatDropdown({
  editor,
  value,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  disabled: boolean;
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

  const elementFormatDropDownItems = [
    {
      text: 'Left Align',
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
      },
      icon: IconAlignLeft,
    },
    {
      text: 'Center Align',
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      },
      icon: IconAlignCenter,
    },
    {
      text: 'Right Align',
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
      },
      icon: IconAlignRight,
    },
    {
      text: 'Justify Align',
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
      },
      icon: IconAlignJustified,
    },
    {
      text: 'Indent',
      onClick: () => {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
      },
      icon: IconIndentIncrease,
    },
    {
      text: 'Outdent',
      onClick: () => {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
      },
      icon: IconIndentDecrease,
    },
  ];

  return (
    <ToolbarDropdown
      type='element-format'
      currentValue={formatOption.name}
      ariaLabel='Formatting options for text alignment'
      items={elementFormatDropDownItems}
      disabled={disabled}
    />
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
      })
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

  return (
    <div className='editor_toolbar'>
      <div className='editor_toolbar_inner'>
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
          <CodeLanguageDropDown
            onCodeLanguageSelect={onCodeLanguageSelect}
            disabled={!isEditable}
            currentValue={codeLanguage}
            editor={editor}
          />
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
            <ColorPickerDropdown
              type='font-color'
              color={fontColor}
              onChange={onFontColorSelect}
              ariaLabel='Formatting text color'
              disabled={!isEditable}
            />
            <ColorPickerDropdown
              type='bg-color'
              color={bgColor}
              onChange={onBgColorSelect}
              ariaLabel='Formatting background color'
              disabled={!isEditable}
            />
            <ElementFormatDropdown
              disabled={!isEditable}
              value={elementFormat}
              editor={editor}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ToolbarPlugin;

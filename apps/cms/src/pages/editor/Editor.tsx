import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import useLexicalEditable from '@lexical/react/useLexicalEditable';
import { createContext, useState } from 'react';
import { useSettings } from './context/SettingsContext';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import ImageGalleryPlugin from './plugins/ImageGalleryPlugin';
import ImageCarouselPlugin from './plugins/ImageCarouselPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import EmbedPlugin from './plugins/EmbedPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

import PostEditorTitle from './components/PostEditorTitle/PostEditorTitle';
import { useDisclosure } from '@mantine/hooks';
import ContentSettingsModal from './components/ContentSettingsModal/ContentSettingsModal';

type SettingsModalContext = {
  settingsModalOpen: boolean;
  open: () => void;
  close: () => void;
  handleSettingsModuleOpen: ({ content }: { content: JSX.Element }) => void;
};

export const SettingsModalContext = createContext<SettingsModalContext>({
  settingsModalOpen: false,
  open: () => {},
  close: () => {},
  // @ts-expect-error 'TODO'
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  handleSettingsModuleOpen({ content }) {
    return;
  },
});

export default function Editor(): JSX.Element {
  const {
    settings: { tableCellMerge, tableCellBackgroundColor },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const [toolbarEnabled, setToolbarEnabled] = useState(true);
  const [settingsModalOpen, { open, close }] = useDisclosure(false);
  const [settingsModalContent, setSettingsModalContent] = useState(<></>);

  const placeholder = <Placeholder>{'Start writing your post...'}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const handleSettingsModuleOpen = ({ content }: { content: JSX.Element }) => {
    setSettingsModalContent(content);
    open();
  };

  return (
    <>
      <ToolbarPlugin
        toolbarEnabled={toolbarEnabled}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <div className='editor-container'>
        <PostEditorTitle setToolbarEnabled={setToolbarEnabled} />
        <div className='editor-container-inner'>
          <DragDropPaste />
          <AutoFocusPlugin />
          <HashtagPlugin />
          <AutoLinkPlugin />
          <>
            <HistoryPlugin />
            <SettingsModalContext.Provider
              value={{
                settingsModalOpen,
                open,
                close,
                handleSettingsModuleOpen,
              }}
            >
              <RichTextPlugin
                contentEditable={
                  <div className='editor' ref={onRef}>
                    <ContentEditable />
                  </div>
                }
                placeholder={placeholder}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </SettingsModalContext.Provider>

            <CodeHighlightPlugin />
            <ListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin
              hasCellMerge={tableCellMerge}
              hasCellBackgroundColor={tableCellBackgroundColor}
            />
            <TableCellResizer />
            <ImagesPlugin />
            <ImageGalleryPlugin />
            <ImageCarouselPlugin />
            <LinkPlugin />
            <EmbedPlugin />
            {!isEditable && <LexicalClickableLinkPlugin />}
            <HorizontalRulePlugin />
            <TabIndentationPlugin />
            <CollapsiblePlugin />
            <LayoutPlugin />
            {floatingAnchorElem && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
        </div>
        <ContentSettingsModal isOpen={settingsModalOpen} close={close}>
          <>{settingsModalContent}</>
        </ContentSettingsModal>
      </div>
    </>
  );
}

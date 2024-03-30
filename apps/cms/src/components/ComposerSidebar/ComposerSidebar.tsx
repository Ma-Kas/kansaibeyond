import { Stack } from '@mantine/core';
import {
  IconSettings,
  IconTags,
  IconSearch,
  IconPlus,
  IconCards,
  IconSeparatorHorizontal,
  IconPhoto,
  IconLayoutGrid,
  IconCarouselHorizontal,
  IconSourceCode,
  IconTable,
  IconLayoutColumns,
  IconSticker2,
  IconLayoutNavbarExpand,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ComposerSidebarButton from '../ComposerSidebarButton/ComposerSidebarButton';
import ComposerDrawer from '../ComposerDrawer/ComposerDrawer';
import classes from './ComposerSidebar.module.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useModal from '../../pages/editor/hooks/useModal';
import { InsertImageDialog } from '../../pages/editor/plugins/ImagesPlugin';
import { InsertGalleryContainerDialog } from '../../pages/editor/plugins/ImageGalleryPlugin';
import {
  $getRoot,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useEffect, useState } from 'react';
import { InsertCarouselContainerDialog } from '../../pages/editor/plugins/ImageCarouselPlugin';
import { InsertEmbedDialog } from '../../pages/editor/plugins/EmbedPlugin';
import { InsertTableDialog } from '../../pages/editor/plugins/TablePlugin';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import InsertLayoutDialog from '../../pages/editor/plugins/LayoutPlugin/InsertLayoutDialog';
import { $createStickyNode } from '../../pages/editor/nodes/StickyNode';
import { INSERT_COLLAPSIBLE_COMMAND } from '../../pages/editor/plugins/CollapsiblePlugin';

const COMPOSER_SIDEBAR_ITEMS = [
  { text: 'Add', icon: IconPlus },
  { text: 'Categories', icon: IconCards },
  { text: 'Tags', icon: IconTags },
  { text: 'SEO', icon: IconSearch },
  { text: 'Settings', icon: IconSettings },
];

const ComposerSidebar = () => {
  const [drawerOpen, { open, close }] = useDisclosure(false);
  const [currentDrawer, setCurrentDrawer] = useState<string | null>(null);
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [modal, showModal] = useModal();

  // Update active lexical editor on selection change
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

  // Items in 'Add' Sidebar Category
  const addDrawerItems = {
    Media: [
      {
        text: 'Image',
        onClick: () => {
          showModal('Insert Image', (onClose) => (
            <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
          ));
        },
        icon: IconPhoto,
      },
      {
        text: 'Gallery',
        onClick: () => {
          showModal('Insert Image Gallery', (onClose) => (
            <InsertGalleryContainerDialog
              activeEditor={activeEditor}
              onClose={onClose}
            />
          ));
        },
        icon: IconLayoutGrid,
      },
      {
        text: 'Carousel',
        onClick: () => {
          showModal('Insert Image Carousel', (onClose) => (
            <InsertCarouselContainerDialog
              activeEditor={activeEditor}
              onClose={onClose}
            />
          ));
        },
        icon: IconCarouselHorizontal,
      },
    ],
    Elements: [
      {
        text: 'Divider',
        onClick: () => {
          activeEditor.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined
          );
        },
        icon: IconSeparatorHorizontal,
      },
      {
        text: 'Table',
        onClick: () => {
          showModal('Insert Table', (onClose) => (
            <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
          ));
        },
        icon: IconTable,
      },
      {
        text: 'Columns Layout',
        onClick: () => {
          showModal('Insert Columns Layout', (onClose) => (
            <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
          ));
        },
        icon: IconLayoutColumns,
      },
      {
        text: 'Sticky Note',
        onClick: () => {
          editor.update(() => {
            const root = $getRoot();
            const stickyNode = $createStickyNode(0, 0);
            root.append(stickyNode);
          });
        },
        icon: IconSticker2,
      },
      {
        text: 'Expandable List',
        onClick: () => {
          editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
        },
        icon: IconLayoutNavbarExpand,
      },
    ],
    'From the web': [
      {
        text: 'Embed Content',
        onClick: () => {
          showModal('Embed Content', (onClose) => (
            <InsertEmbedDialog activeEditor={activeEditor} onClose={onClose} />
          ));
        },
        icon: IconSourceCode,
      },
    ],
  };

  // Ensures correct content, depending on which button is pressed, is populated
  // before opening
  // Ensures closing when same button is pressed again, but not closing, just
  // change of content if other button is pressed
  const handleSidebarButtonClick = (type: string) => {
    if (!drawerOpen) {
      if (currentDrawer !== type) {
        setCurrentDrawer(type);
      }
      open();
    } else {
      if (currentDrawer === type) {
        close();
      } else {
        setCurrentDrawer(type);
      }
    }
  };

  const switchRenderedDrawerOnType = () => {
    switch (currentDrawer) {
      case 'Add': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            opened={drawerOpen}
            close={close}
          >
            {Object.keys(addDrawerItems).map((key) => {
              return (
                <div key={key} className={classes['sidebar_drawer_add_group']}>
                  <div className={classes['sidebar_drawer_add_subheader']}>
                    {key}
                  </div>
                  <div className={classes['sidebar_drawer_add_grid_group']}>
                    {addDrawerItems[key as keyof typeof addDrawerItems].map(
                      (item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.text}
                            onClick={item.onClick}
                            className={classes['sidebar_drawer_add_button']}
                          >
                            <Icon />
                            <span>{item.text}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </ComposerDrawer>
        );
      }
      case 'Categories': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            opened={drawerOpen}
            close={close}
          >
            <div className={classes['sidebar_drawer_category_description']}>
              Create categories to organize topics and help readers find posts
              that interest them.
            </div>
            <div className={classes['sidebar_drawer_category_list_container']}>
              Assign a category
            </div>
          </ComposerDrawer>
        );
      }
      case 'Tags': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            opened={drawerOpen}
            close={close}
          >
            <div className={classes['sidebar_drawer_tags_description']}>
              Create and assign tags to help readers find the blog posts they're
              looking for.
            </div>
          </ComposerDrawer>
        );
      }
      case 'SEO': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            opened={drawerOpen}
            close={close}
          >
            <div></div>
          </ComposerDrawer>
        );
      }
      case 'Settings': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            opened={drawerOpen}
            close={close}
          >
            <div></div>
          </ComposerDrawer>
        );
      }
      default: {
        return (
          <ComposerDrawer type='Placeholder' opened={false} close={close}>
            <div></div>
          </ComposerDrawer>
        );
      }
    }
  };

  return (
    <aside className={classes['composer_sidebar_container']}>
      <div className={classes['composer_sidebar']}>
        <div className={classes['composer_sidebar_inner']}>
          <Stack gap={'lg'}>
            {COMPOSER_SIDEBAR_ITEMS.map((item) => {
              return (
                <ComposerSidebarButton
                  key={item.text}
                  icon={item.icon}
                  text={item.text}
                  onClick={() => handleSidebarButtonClick(item.text)}
                ></ComposerSidebarButton>
              );
            })}
          </Stack>
        </div>
      </div>
      {switchRenderedDrawerOnType()}
      {modal}
    </aside>
  );
};

export default ComposerSidebar;

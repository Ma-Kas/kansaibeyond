import { useCallback, useEffect, useState } from 'react';
import { Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
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

// Page Component Imports
import ComposerSidebarButton from '../ComposerSidebarButton/ComposerSidebarButton';
import ComposerDrawer from '../ComposerDrawer/ComposerDrawer';
import ComposerDrawerContentCategories from '../ComposerDrawerContent/ComposerDrawerContentCategories';
import ComposerDrawerContentTags from '../ComposerDrawerContent/ComposerDrawerContentTags';
import ComposerDrawerContentSettings from '../ComposerDrawerContent/ComposerDrawerContentSettings';
import { Post } from '../../requests/postRequests';

// Lexical Editor Imports
import {
  $getRoot,
  COMMAND_PRIORITY_CRITICAL,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useModal from '../../pages/Editor/hooks/useModal';
import { InsertEmbedDialog } from '../../pages/Editor/plugins/EmbedPlugin';
import { InsertTableDialog } from '../../pages/Editor/plugins/TablePlugin';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import InsertLayoutDialog from '../../pages/Editor/plugins/LayoutPlugin/InsertLayoutDialog';
import { $createStickyNode } from '../../pages/Editor/nodes/StickyNode';
import { INSERT_COLLAPSIBLE_COMMAND } from '../../pages/Editor/plugins/CollapsiblePlugin';
import {
  handleInsertCarouselImages,
  handleInsertGalleryImages,
  handleInsertSingleImage,
} from '../../utils/editor-image-insert-helper';

// Style Imports
import classes from './ComposerSidebar.module.css';
import { destroyWidgets } from '../CloudinaryMediaLibraryWidget/cloudinary-helpers';
import { LoadingNotification } from '../FeedbackPopups/FeedbackPopups';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from '../../config/constants';
import { InsertReturnData } from '../CloudinaryMediaLibraryWidget/cloudinary-types';

const COMPOSER_SIDEBAR_ITEMS = [
  { text: 'Add', icon: IconPlus },
  { text: 'Categories', icon: IconCards },
  { text: 'Tags', icon: IconTags },
  { text: 'SEO', icon: IconSearch },
  { text: 'Settings', icon: IconSettings },
];

const ComposerSidebar = ({ postData }: { postData: Post }) => {
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

  const createCloudinaryMediaLibraryWidget = useCallback(
    (
      multiple: boolean,
      handler: (data: InsertReturnData, activeEditor: LexicalEditor) => void
    ) => {
      const loadingMediaLibraryPopup = notifications.show(
        LoadingNotification({ bodyText: 'Opening Media Library Widget' })
      );
      destroyWidgets();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      window.cloudinary.openMediaLibrary(
        {
          cloud_name: CLOUDINARY_CLOUD_NAME,
          api_key: CLOUDINARY_API_KEY,
          remove_header: false,
          multiple: { multiple },
          insert_caption: 'Insert',
          default_transformations: [[]],
        },
        {
          insertHandler: (data: InsertReturnData) => {
            handler(data, activeEditor);
          },
          showHandler: () => {
            notifications.hide(loadingMediaLibraryPopup);
          },
        }
      );
    },
    [activeEditor]
  );

  // Items in 'Add' Sidebar Category
  const addDrawerItems = {
    Media: [
      {
        text: 'Image',
        onClick: () =>
          createCloudinaryMediaLibraryWidget(false, handleInsertSingleImage),
        icon: IconPhoto,
      },
      {
        text: 'Gallery',
        onClick: () =>
          createCloudinaryMediaLibraryWidget(true, handleInsertGalleryImages),
        icon: IconLayoutGrid,
      },
      {
        text: 'Carousel',
        onClick: () =>
          createCloudinaryMediaLibraryWidget(true, handleInsertCarouselImages),
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
                        // TODO: Temporarily disabled nodes that are still a bit buggy, but low fix priority
                        return (
                          <button
                            type='button'
                            key={item.text}
                            onClick={item.onClick}
                            className={classes['sidebar_drawer_add_button']}
                            disabled={[
                              'Table',
                              'Columns Layout',
                              'Expandable List',
                            ].includes(item.text)}
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
            description='Create categories to organize topics and help readers find posts that
            interest them.'
            opened={drawerOpen}
            close={close}
          >
            <ComposerDrawerContentCategories />
          </ComposerDrawer>
        );
      }
      case 'Tags': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            description='Create and assign tags to help readers find the blog posts they&#39;re
            looking for.'
            opened={drawerOpen}
            close={close}
          >
            <ComposerDrawerContentTags />
          </ComposerDrawer>
        );
      }
      case 'SEO': {
        return (
          <ComposerDrawer
            type={currentDrawer}
            description='Edit settings to optimise this post for search engines and visitors.'
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
            description='Edit various settings to categorise content, and help readers discover your post.'
            opened={drawerOpen}
            close={close}
          >
            <ComposerDrawerContentSettings postData={postData} />
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
                  drawerOpen={drawerOpen}
                  currentDrawer={currentDrawer}
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

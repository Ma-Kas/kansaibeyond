import { Stack } from '@mantine/core';
import {
  IconSettings,
  IconTags,
  IconSearch,
  IconPlus,
  IconColorSwatch,
} from '@tabler/icons-react';
import ComposerSidebarButton from '../ComposerSidebarButton/ComposerSidebarButton';
import classes from './ComposerSidebar.module.css';

const mockdata = [
  { text: 'Add', icon: IconPlus },
  { text: 'Categories', icon: IconColorSwatch },
  { text: 'Tags', icon: IconTags },
  { text: 'SEO', icon: IconSearch },
  { text: 'Settings', icon: IconSettings },
];

const ComposerSidebar = () => {
  return (
    <aside className={classes['composer_sidebar']}>
      <div className={classes['composer_sidebar_inner']}>
        <Stack gap={'lg'}>
          {mockdata.map((item) => {
            return (
              <ComposerSidebarButton
                key={item.text}
                icon={item.icon}
                text={item.text}
              ></ComposerSidebarButton>
            );
          })}
        </Stack>
      </div>
    </aside>
  );
};

export default ComposerSidebar;

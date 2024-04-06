import { ScrollArea } from '@mantine/core';
import {
  IconNotes,
  IconPresentationAnalytics,
  IconSettings,
  IconHome,
  IconPhoto,
  IconUsers,
} from '@tabler/icons-react';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import classes from './NavbarMain.module.css';

const mockdata = [
  { label: 'Home', icon: IconHome },
  {
    label: 'Blog',
    icon: IconNotes,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Posts', link: '/' },
      { label: 'Comments', link: '/' },
      { label: 'Categories', link: '/' },
      { label: 'Tags', link: '/' },
    ],
  },
  { label: 'People', icon: IconUsers },
  { label: 'Image Library', icon: IconPhoto },
  {
    label: 'Analytics',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Real-time', link: '/' },
      { label: 'Insights', link: '/' },
      { label: 'Alerts and Emails', link: '/' },
    ],
  },
  {
    label: 'Analytics2',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Overview2', link: '/' },
      { label: 'Real-time2', link: '/' },
      { label: 'Insights2', link: '/' },
      { label: 'Alerts and Emails2', link: '/' },
    ],
  },
  { label: 'Settings', icon: IconSettings },
];

const NavbarMain = () => {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <ScrollArea
        className={classes['navbar_scrollarea']}
        type='never'
        offsetScrollbars={false}
      >
        <div className={classes['navbar_body']}>
          <div className={classes['navbar_links']}>{links}</div>
        </div>
      </ScrollArea>
    </nav>
  );
};

export default NavbarMain;

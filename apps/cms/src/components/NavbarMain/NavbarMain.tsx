import { ScrollArea } from '@mantine/core';
import {
  IconNotes,
  IconPresentationAnalytics,
  IconSettings,
  IconHome,
  IconPhoto,
  IconUsers,
} from '@tabler/icons-react';
import NavbarLinksGroup from '../NavbarLinksGroup/NavbarLinksGroup';
import classes from './NavbarMain.module.css';

const navbarData = [
  { label: 'Home', icon: IconHome, link: '/dashboard' },
  {
    label: 'Blog',
    icon: IconNotes,
    links: [
      { label: 'Overview', link: '/dashboard/blog/overview' },
      { label: 'Posts', link: '/dashboard/blog/posts' },
      { label: 'Comments', link: '/dashboard/blog/comments' },
      { label: 'Categories', link: '/dashboard/blog/categories' },
      { label: 'Tags', link: '/dashboard/blog/tags' },
    ],
  },
  { label: 'People', icon: IconUsers, link: '/dashboard/people' },
  { label: 'Image Library', icon: IconPhoto, link: '/dashboard/images' },
  {
    label: 'Analytics',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Overview', link: '/dashboard/analytics/overview' },
      { label: 'Real-time', link: '/dashboard/analytics/realtime' },
      { label: 'Insights', link: '//dashboard/analytics/insights' },
      { label: 'Alerts and Emails', link: '//dashboard/analytics/alerts' },
    ],
  },
  { label: 'Settings', icon: IconSettings, link: '/dashboard/settings' },
];

const NavbarMain = () => {
  const links = navbarData.map((item) => (
    <NavbarLinksGroup {...item} key={item.label} />
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

import { Tabs } from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import ContentCardTable, {
  BlogTableData,
} from '../ContentCardTable/ContentCardTable';
import classes from './BlogPostTabs.module.css';

export type TabData = {
  value: string;
  label: string;
  blogTableData: BlogTableData[];
};

type TabDataProps = {
  mainContentHeaderElement: HTMLDivElement | null;
  mainContentBodyElement: HTMLDivElement | null;
  tabData: TabData[];
  cardElement: HTMLDivElement | null;
};

const BlogPostTabs = ({
  mainContentHeaderElement,
  mainContentBodyElement,
  tabData,
  cardElement,
}: TabDataProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(tabData[0].value);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  // Calculate the top of the sticky card header based on content_header height
  // and margin-top of body passed as ref (useEffect, to force re-render when they change)
  useEffect(() => {
    if (mainContentHeaderElement && mainContentBodyElement) {
      const contentHeaderHeight = window.getComputedStyle(
        mainContentHeaderElement
      ).height;
      const contentBodyMarginTop = window.getComputedStyle(
        mainContentBodyElement
      ).marginTop;

      const top = `${
        Number(contentHeaderHeight.slice(0, -2)) +
        Number(contentBodyMarginTop.slice(0, -2))
      }px`;
      setHeaderTopStyle(top);
    }
  }, [mainContentBodyElement, mainContentHeaderElement]);

  if (!cardElement || !mainContentHeaderElement || !mainContentBodyElement) {
    return null;
  }

  return (
    <Tabs
      className={classes['page_main_content_card_tabs']}
      value={activeTab}
      onChange={setActiveTab}
    >
      <Tabs.List className={classes['page_main_content_card_tabs_list']}>
        {tabData.map((tab) => {
          return (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label.concat(` (${tab.blogTableData.length})`)}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
      {tabData.map((tab) => {
        return (
          <Fragment key={tab.value}>
            {createPortal(
              <Tabs.Panel
                className={classes['page_main_content_card_tabs_panel']}
                value={tab.value}
              >
                <ContentCardTable
                  type='posts'
                  headerTopStyle={headerTopStyle}
                  blogTableData={tab.blogTableData}
                />
              </Tabs.Panel>,
              cardElement
            )}
          </Fragment>
        );
      })}
    </Tabs>
  );
};

export default BlogPostTabs;

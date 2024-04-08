import { Tabs } from '@mantine/core';
import { Fragment, useState } from 'react';
import { createPortal } from 'react-dom';

import classes from './PageMainContentHeaderTabs.module.css';

export type TabData = {
  value: string;
  label: string;
  panelData: React.ReactNode;
};

type TabDataProps = {
  tabData: TabData[];
  cardElement: HTMLDivElement | null;
};

const MainContentHeaderTabs = ({ tabData, cardElement }: TabDataProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(tabData[0].value);

  if (!cardElement) {
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
              {tab.label.concat(' (0)')}
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
                {tab.panelData}
              </Tabs.Panel>,
              cardElement
            )}
          </Fragment>
        );
      })}
    </Tabs>
  );
};

export default MainContentHeaderTabs;

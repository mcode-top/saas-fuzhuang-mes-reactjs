import React, { useEffect, useRef, useMemo } from 'react';
import { Tabs, Dropdown, Menu } from 'antd';
import { history, useLocation } from 'umi';
import type { TabsProps } from 'antd/lib/tabs';
import type { MenuProps } from 'antd/lib/menu';
import type * as H from 'history-with-query';
import { usePersistFn } from 'ahooks';
import type { UseSwitchTabsOptions, ActionType, SwitchTab } from 'use-switch-tabs';
import useSwitchTabs from 'use-switch-tabs';
import classNames from 'classnames';
import _get from 'lodash/get';

import styles from './index.less';

enum CloseTabKey {
  Current = 'current',
  Others = 'others',
  ToRight = 'toRight',
}

export interface RouteTab {
  /** tab's title */
  tab: React.ReactNode;
  key: string;
  content: JSX.Element;
  closable?: boolean;
  /** used to extends tab's properties */
  location: Omit<H.Location, 'key'>;
}

export interface SwitchTabsProps
  extends Omit<UseSwitchTabsOptions, 'location' | 'history'>,
    Omit<TabsProps, 'hideAdd' | 'activeKey' | 'onEdit' | 'onChange' | 'children'> {
  fixed?: boolean;
  footerRender?: (() => React.ReactNode) | false;
}

export default function SwitchTabs(props: SwitchTabsProps): JSX.Element {
  const { mode, fixed, originalRoutes, setTabName, persistent, children, ...rest } = props;

  const location = useLocation() as any;
  const actionRef = useRef<ActionType>();

  const { tabs, activeKey, handleSwitch, handleRemove, handleRemoveOthers, handRemoveRightTabs } =
    useSwitchTabs({
      children,
      setTabName,
      originalRoutes,
      mode,
      persistent,
      location,
      history,
      actionRef,
    });

  const remove = usePersistFn((key: string) => {
    handleRemove(key);
  });
  const handleTabEdit = usePersistFn((targetKey: string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      remove(targetKey);
    }
  });

  const handleTabsMenuClick = usePersistFn((tabKey: string): MenuProps['onClick'] => (event) => {
    const { key, domEvent } = event;
    domEvent.stopPropagation();

    if (key === CloseTabKey.Current) {
      handleRemove(tabKey);
    } else if (key === CloseTabKey.Others) {
      handleRemoveOthers(tabKey);
    } else if (key === CloseTabKey.ToRight) {
      handRemoveRightTabs(tabKey);
    }
  });

  const setMenu = usePersistFn((key: string, index: number) => (
    <Menu onClick={handleTabsMenuClick(key)}>
      <Menu.Item disabled={tabs?.length === 1} key={CloseTabKey.Current}>
        关闭当前标签
      </Menu.Item>
      <Menu.Item disabled={tabs?.length === 1} key={CloseTabKey.Others}>
        关闭其他标签
      </Menu.Item>
      <Menu.Item disabled={tabs?.length === index + 1} key={CloseTabKey.ToRight}>
        关闭右侧标签
      </Menu.Item>
    </Menu>
  ));

  const setTab = usePersistFn(
    (tab: React.ReactNode, key: string, index: number, item: SwitchTab) => {
      let title = tab;
      if ((item?.location as any)?.query?._systemTabName) {
        title = (item?.location as any)?.query?._systemTabName;
      }
      return (
        <span onContextMenu={(event) => event.preventDefault()}>
          <Dropdown overlay={setMenu(key, index)} trigger={['contextMenu']}>
            <span className={styles.tabTitle}>{title}</span>
          </Dropdown>
        </span>
      );
    },
  );

  /**@name 将TAB操作暴露到全局 */
  useEffect(() => {
    window.layoutTabsAction = {
      getLocationToTabKey: (currentLocation: SwitchTab['location']): SwitchTab | undefined => {
        return tabs.find((i) => {
          return (
            decodeURI(i.location.pathname) === decodeURI(currentLocation.pathname) &&
            decodeURI(i.location.search) === decodeURI(currentLocation.search) &&
            i.location.hash === currentLocation.hash &&
            i.location.state === currentLocation.state
          );
        });
      },
      goAndClose: (path: string, isRefresh?: boolean): void => {
        if (isRefresh === true) {
          window.tabsAction.reloadTab(path);
        }
        const currentTab = window.layoutTabsAction.getLocationToTabKey(location);
        window.tabsAction.goBackTab(
          path,
          () => {
            setTimeout(() => {
              window.tabsAction.closeTab(currentTab?.key);
            }, 0);
          },
          isRefresh,
        );
      },
    };
  }, [tabs, location]);
  useEffect(() => {
    window.tabsAction = actionRef.current!;
  }, [actionRef.current]);
  return (
    <Tabs
      tabPosition="top"
      type="editable-card"
      tabBarStyle={{ margin: 0 }}
      tabBarGutter={0}
      animated={false}
      className={classNames('switch-tabs', { 'switch-tabs-fixed': fixed })}
      {...rest}
      hideAdd
      activeKey={activeKey}
      onEdit={handleTabEdit as TabsProps['onEdit']}
      onChange={handleSwitch}
    >
      {tabs.map((item, index) => (
        <Tabs.TabPane
          tab={setTab(item.title, item.key, index, item)}
          key={item.key}
          closable={item.closable}
          forceRender={_get(persistent, 'force', false)}
        >
          <main className={styles.content}>
            <div style={{ padding: 12, height: '100%', overflowY: 'auto' }}>{item.content}</div>
          </main>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}

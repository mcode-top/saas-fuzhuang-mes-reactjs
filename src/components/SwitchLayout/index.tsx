import { getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import React from 'react';
import type * as H from 'history-with-query';
import { useLocation, useRouteMatch } from 'umi';
import type { Route } from '@ant-design/pro-layout/lib/typings';
import { PageLoading } from '@ant-design/pro-layout';
import * as _ from 'lodash';
import type { Mode, RouteConfig } from 'use-switch-tabs';
import { isSwitchTab } from 'use-switch-tabs';
import type { SwitchTabsProps } from './SwitchTabs';
import SwitchTabs from './SwitchTabs';
import { traverseTree } from '@/utils';

export interface MakeUpRoute extends Route, Pick<RouteConfig, 'follow'> {}

export interface RouteTabsLayoutProps
  extends Pick<SwitchTabsProps, 'persistent' | 'fixed' | 'setTabName' | 'footerRender'> {
  mode?: Mode | false;
  loading?: boolean;
  routes?: RouteConfig[];
  children: React.ReactElement;
} /** 根据路由定义中的 name 本地化标题 */

export default function SwitchTabsLayout(props: RouteTabsLayoutProps): JSX.Element {
  const { mode, loading, routes, children, ...rest } = props;
  if (mode) {
    if (loading) {
      return <PageLoading />;
    }

    if (routes) {
      return (
        <SwitchTabs
          mode={mode}
          {...rest}
          originalRoutes={routes}
          // animated={false}
        >
          {children}
        </SwitchTabs>
      );
    }
  }
  return children;
}

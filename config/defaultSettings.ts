import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { UseSwitchTabsOptions } from 'use-switch-tabs';
import { Mode } from 'use-switch-tabs';

export type SwitchTabsOptions = {
  mode: Mode;
  /** 固定标签页头部 */
  fixed?: boolean;
  /** 是否在顶栏显示刷新按钮 */
  reloadable?: boolean;
} & Pick<UseSwitchTabsOptions, 'persistent'>;
export type Settings = LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  switchTabs?: SwitchTabsOptions;
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Settings: Settings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'LIMS-SAAS',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  switchTabs: {
    mode: Mode.Dynamic,
    fixed: true,
    reloadable: false,
    persistent: false,
  },
};

export default Settings;

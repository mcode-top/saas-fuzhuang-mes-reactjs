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
  title: 'SAAS',
  pwa: false,
  logo: 'https://zh-home.oss-cn-hangzhou.aliyuncs.com/home/images/logo1.png',
  iconfontUrl: '',
  switchTabs: {
    mode: Mode.Dynamic,
    fixed: true,
    reloadable: true,
    persistent: true,
  },
};

export default Settings;

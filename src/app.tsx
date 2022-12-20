import { getMenuData } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { ErrorShowType, history, setCreateHistoryOptions } from 'umi';
import RightContent from '@/components/RightContent';
import { isUUID } from './utils';
import {
  LOGIN_PATH,
  TENANT_SESSION_PATH,
  TENANT_HEADER_TOKEN,
  WEB_SOCKET_URL,
} from './configs/index.config';
import { requestInterceptors, responseInterceptors } from './apis/request';
import { getCurrentUser } from './apis/user';
import 'react-contexify/dist/ReactContexify.css';
import type { UserInfo } from './apis/user/typings';
import SwitchTabsLayout from './components/SwitchLayout';
import type { Settings } from '../config/defaultSettings';
import defaultSettings from '../config/defaultSettings';
import { getMatchMenu } from '@umijs/route-utils';
import storageDataSource from './utils/storage';
import type { ApiTreeType } from './apis/person/typings';
import { UserWebSocket } from './utils/websocket';
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import IPageLoading from './components/PageLoading';
import { message } from 'antd';
import { testTemplate3 } from './browers-test/excel-template';
import SelectUploadFile from './components/Comm/FormlyComponents/Upload';
import FilePositionImage from './components/Comm/FilePositionImage';
const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <IPageLoading />,
};

export type InitialStateType = {
  settings?: Partial<Settings>;
  currentUser?: UserInfo & {
    roleIds?: number[];
    apis: ApiTreeType[];
    isAdmin: boolean;
    roleLever: number;
    deptLever: number;
    tenantId: string;
  };
  userWebSocket?: UserWebSocket;
  loading?: boolean;
  fetchUserInfo?: () => Promise<InitialStateType['currentUser'] | undefined>;
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialStateType> {
  testTemplate3();
  const fetchUserInfo = async () => {
    try {
      const result = await getCurrentUser();
      return result.data;
    } catch (error) {
      console.error(error);

      history.push(LOGIN_PATH);
    }
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== LOGIN_PATH) {
    if (sessionStorage.getItem(TENANT_HEADER_TOKEN)) {
      try {
        const currentUser = await fetchUserInfo();
        const websocket = new UserWebSocket(
          WEB_SOCKET_URL,
          sessionStorage.getItem(TENANT_HEADER_TOKEN) as string,
        );
        await storageDataSource.loader();
        await websocket.login();

        currentUser.roleIds = currentUser?.roleList.map((r) => r.id);
        return {
          fetchUserInfo,
          currentUser,
          userWebSocket: websocket,
          settings: defaultSettings,
        };
      } catch (error) {
        message.error('登录失败!请检查网络或联系服务商');
        history.push(LOGIN_PATH);
      }
    } else {
      // message.warning('认证不存在,请重新登录');
      history.push(LOGIN_PATH);
    }
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const { switchTabs, ...restSettings } = initialState?.settings || {};

  return {
    rightContentRender: () => {
      return <RightContent />;
    },
    disableContentMargin: false,
    // 水印
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    className: switchTabs?.mode && 'custom-by-switch-tabs',

    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!sessionStorage.getItem(TENANT_HEADER_TOKEN) && location.pathname !== LOGIN_PATH) {
        history.push(LOGIN_PATH);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      if (initialState?.loading) {
        return <IPageLoading />;
      }
      const { route } = props;
      const { location } = history;
      if (route?.routes) {
        const { menuData } = getMenuData(route.routes);
        const matchMenus = getMatchMenu(location.pathname, menuData, undefined, false);
        const currentMenu = matchMenus[matchMenus.length - 1] || {};
        if (currentMenu.layout != false) {
          return (
            <SwitchTabsLayout
              mode={switchTabs?.mode}
              persistent={false}
              fixed={switchTabs?.fixed}
              routes={route!.routes}
            >
              <>{children}</>

              {/* 3cfbc387-b7be-40d7-b7af-8b04a701af28/2022-09-06/12_10_08_449_458181-200RQ45536.png */}
            </SwitchTabsLayout>
          );
        }
      }
      return (
        <>
          <PhotoProvider>{children}</PhotoProvider>
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};
export function render(oldRender: () => void) {
  const originPath = history.location.pathname;
  setCreateHistoryOptions({
    basename: `/fz/${originPath.split('/')[1]}/`, //你要设置的前缀
  });
  sessionStorage.setItem(TENANT_SESSION_PATH, originPath.split('/')[1]);

  oldRender();
}
/**
 * 全局请求配置
 */
export const request: RequestConfig = {
  timeout: 10000,

  errorConfig: {
    errorPage: LOGIN_PATH,
    adaptor: (resData, ctx) => {
      let success = true;
      let showType: ErrorShowType | undefined = undefined;
      if (resData.code !== 200) {
        success = false;
        console.error('url', ctx.req.url, 'ctx', ctx, 'resData', resData);
      }
      resData.msg = resData.msg || resData.data;
      if (resData.code === 412) {
        showType = ErrorShowType.REDIRECT;
      } else if (resData.code === 500) {
        showType = ErrorShowType.NOTIFICATION;
        resData.msg = '内部服务出错:' + resData.msg;
      } else if (resData.code === 403 || resData.code === 400) {
        showType = ErrorShowType.WARN_MESSAGE;
        if (resData.code === 403) {
          resData.msg = '权限不足:' + resData.msg;
        } else if (resData.code === 400) {
          resData.msg = '操作有误:' + resData.msg;
        }
      }

      return {
        success,
        errorCode: resData.code,
        errorMessage: resData.msg,
        showType,
      };
    },
  },
  middlewares: [
    async (ctx, next) => {
      await next();
    },
  ],
  // prefix: '/v1/api',
  requestInterceptors: [...requestInterceptors],
  responseInterceptors: [...responseInterceptors],
};

import type { MenuTreeType } from '@/apis/person/typings';
import type { RouteContextType } from '@ant-design/pro-layout';
import { isEmpty } from 'lodash';
import { Router } from 'umi';
import type { FileManageAuthModeEnum, FileManageFileAuthGroup } from './apis/file-manage/typings';
import { FileManageModeEnum } from './apis/file-manage/typings';
import type { InitialStateType } from './app';

/**
 * React 组件权限管理
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: InitialStateType) {
  const { currentUser } = initialState || {};
  const authMenus = currentUser?.menus?.reduce<Record<string, boolean>>((p, n) => {
    p[n.name + '_' + n.router] = true;
    n.children?.forEach((e) => {
      p[e.name + '_' + e.router] = true;
    });
    return p;
  }, {});
  const isAdmin = currentUser?.isAdmin;
  const apis = currentUser?.apis;
  return {
    /**
     * 菜单权限
     */
    menuAuth: (route: { access: string; name: string; path: string }) => {
      // TODO:待补充
      if (route.access === 'menuAuth') {
        return Boolean(authMenus?.[route.name + '_' + route.path]);
      }
      return true;
    },

    checkApi: (url: string, version = 1) => {
      return (
        isAdmin || apis?.findIndex((api) => api?.uri === formatVersonToFullUrl(url, version)) !== -1
      );
    },
    checkFileManage: (
      fileAuthGroup: FileManageFileAuthGroup[],
      authMode: FileManageAuthModeEnum,
      mode: FileManageModeEnum,
    ) => {
      if (isAdmin || mode === FileManageModeEnum.Personage) {
        return true;
      }
      if (isEmpty(fileAuthGroup)) {
        return false;
      }
      console.log(fileAuthGroup);

      return (
        fileAuthGroup.findIndex((auth) => {
          if (auth?.mode && auth?.mode >= authMode && currentUser) {
            return (
              auth.deptIds?.includes(currentUser?.deptId) ||
              auth.roleIds?.findIndex((role) => currentUser?.roleIds?.includes(role)) !== -1 ||
              auth.userIds?.includes(currentUser?.id)
            );
          }
          return false;
        }) !== -1
      );
    },
  };
}
function formatVersonToFullUrl(url: string, version: number): string {
  if (version === 1) {
    return '/api/v1' + url;
  }
  return url;
}

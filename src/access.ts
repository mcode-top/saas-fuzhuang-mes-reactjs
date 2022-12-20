import type { ApiMethodEnum, ApiTreeType, MenuTreeType } from '@/apis/person/typings';
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
    p[n.router] = true;
    n.children?.forEach((e) => {
      p[e.router] = true;
    });
    return p;
  }, {});
  const isAdmin = currentUser?.isAdmin;
  // 将树变扁变可搜索对象
  const authApis = currentUser?.apis?.reduce<Record<string, ApiTreeType>>((p, n) => {
    if (n.children) {
      n.children.forEach((api) => {
        p[`${api.method}_${api.uri}`] = api;
      });
    }
    return p;
  }, {});
  return {
    /**
     * 菜单权限
     */
    menuAuth: (route: { access: string; name: string; path: string }) => {
      console.log('====================================');
      console.log(authMenus, authMenus?.[route.path]);
      console.log('====================================');
      // TODO:待补充
      return Boolean(authMenus?.[route.path]);
    },
    /**@name 检查显示权限 */
    checkShowAuth(url: string, method: ApiMethodEnum) {
      return Boolean(isAdmin || authApis?.[`${method}_${url}`]);
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

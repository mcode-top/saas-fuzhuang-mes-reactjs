export enum MenuTypeEnum {
  CATALOG = '0',
  MENU = '1',
  LINK = '2',
}

export enum ApiTypeEnum {
  CATALOG = '0',
  LINK = '1',
}

/**@name API接口类型 */
export enum ApiMethodEnum {
  GET = '0',
  POST = '1',
  DELETE = '2',
  PUT = '3',
  PATCH = '4',
  OPTIONS = '5',
  HEAD = '6',
}
export enum ApiDataAccessEnum {
  仅访问自己的数据 = '0',
  访问自己及下级数据 = '1',
  数据所有人可访问 = '2',
}

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-01 09:36:34
 * @Description: 用户接口传参类型
 */
export type DeptTreeType = {
  name: string;
  id: number;
  parentId: number;
  deptKey: string;
  parentName: string;
  key: number;
  children?: DeptTreeType[];
};
export type UserListItem = {
  id: number;
  sex: number;
  status: number;
  phone: string;
  username: string;
  name: string;
  email: string;
  dept?: DeptTreeType;
  deptId?: number;
  roleList?: RoleTreeType[];
};
export type UserListPageParamQuery = {
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  remark?: string;
  createdAt?: Date[];
  updatedAt?: Date[];
  status?: number[];
  sex?: number[];
  deptId?: number;
  ['roleList.id']?: number;
};
export type UserListPageParamOrder = {
  updatedAt?: string;
  createdAt?: string;
};
export type RoleTreeType = {
  name: string;
  id: number;
  key: number;
  roleKey: string;
  label: string;
  children?: RoleTreeType[];
  menuList?: MenuTreeType[];
  apiList?: ApiTreeType[];
};
export type MenuTreeType = {
  name: string;
  id: number;
  router: string;
  type: MenuTypeEnum;
  icon?: string;
  label: string;
  viewPath?: string;
  keepAlive: boolean;
  isShow: boolean;
  description?: string;
  parentId: number;
  children?: MenuTreeType[];
};

export type ApiTreeType = {
  name: string;
  id: number;
  key: string;
  uri?: string;
  type: ApiTypeEnum;
  auth: boolean;
  description?: string;
  children?: ApiTreeType[];
  parentId: number;
  dataAccess: number;
  method: ApiMethodEnum;
};

export type OperationDeptDTO = {
  parentId?: number;
  orderNum?: number;
  id?: number;
  name?: string;
  deptKey?: string;
};
export type OperationUserDTO = {
  name?: string;
  username?: string;
  password?: string;
  phone?: string;
  email?: string;
  sex?: number;
  remark?: string;
  roleIds?: number[];
  deptId?: number;
  status?: number;
};
export type OperationRoleDTO = {
  name?: string;
  id?: number;
  orderNum?: number;
  label?: string;
  remark?: string;
  roleKey?: string;
  parentId?: number;
};

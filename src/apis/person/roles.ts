/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-02 14:54:18
 * @Description: 接口 - 角色
 */

import { request } from 'umi';
import type { ApiTreeType, MenuTreeType, OperationRoleDTO, RoleTreeType } from './typings';

/**
 * 根据当前权限获取可选择的角色列表 (必须携带token)
 */
export function fetchRoleAuthList() {
  return request<RESULT_SUCCESS<RoleTreeType[]>>('/role/auth/list', {
    method: 'GET',
  });
}

/**
 * 获取角色树
 */
export function fetchRoleTree() {
  return request<RESULT_SUCCESS<RoleTreeType[]>>('/role/tree', {
    method: 'POST',
  });
}
/**
 * 根据当前权限获取菜单列表 (必须携带token)
 */
export function fetchMenuAuthTree() {
  return request<RESULT_SUCCESS<MenuTreeType[]>>('/menu/tree', {
    method: 'POST',
  });
}
/**
 * 根据当前权限获取接口列表 (必须携带token)
 */
export function fetchApiAuthTree() {
  return request<RESULT_SUCCESS<ApiTreeType[]>>('/api/tree', {
    method: 'POST',
  });
}

/**
 * 通过角色Id获取角色详情(包含拥有的菜单列表及接口列表)
 * @param id
 * @returns
 */
export function fetchIdToRoleInfo(id: number) {
  return request<RESULT_SUCCESS<RoleTreeType>>('/role/' + id, {
    method: 'GET',
  });
}
/**
 * 根据角色ID更新可用的菜单列表
 * @param id
 * @param menuIds
 * @returns
 */
export function updateRoleInMenus(id: number, menuIds: number[]) {
  return request<RESULT_SUCCESS<any>>('/role/menu/' + id, {
    method: 'PATCH',
    data: menuIds,
  });
}
/**
 * 根据角色ID更新可用的菜单列表
 * @param id
 * @param menuIds
 * @returns
 */
export function updateRoleInApis(id: number, menuIds: number[]) {
  return request<RESULT_SUCCESS<any>>('/role/api/' + id, {
    method: 'PATCH',
    data: menuIds,
  });
}

/**
 * 删除角色
 */
export function deleteRole(id: number) {
  return request('/role/' + id, {
    method: 'DELETE',
  });
}
/**
 * 创建角色
 */
export function createRole(data: OperationRoleDTO) {
  return request('/role', {
    method: 'POST',
    data,
  });
}
/**
 * 更新角色
 */
export function updateRole(id: number, data: OperationRoleDTO) {
  return request('/role/' + id, {
    method: 'PATCH',
    data,
  });
}

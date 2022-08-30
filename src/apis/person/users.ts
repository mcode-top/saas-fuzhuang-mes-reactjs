/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-01 16:40:50
 * @Description: 接口 - 人员管理
 */
import { request } from 'umi';
import type {
  DeptTreeType,
  OperationDeptDTO,
  OperationUserDTO,
  UserListItem,
  UserListPageParamOrder,
  UserListPageParamQuery,
} from './typings';

/**
 * 获取部门树
 */
export function fetchDeptTree() {
  return request('/dept/tree', {
    method: 'POST',
  });
}
/**
 * 分页获取用户列表
 */
export function fetchUserList(
  data: PAGINATION_QUERY.Param<UserListPageParamQuery, UserListPageParamOrder>,
) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<UserListItem>>>('/user/page', {
    method: 'POST',
    data,
  });
}
/**
 *  根据自己权限获取可使用的部门 (必须携带token)
 */
export function fetchDeptAuthList() {
  return request<RESULT_SUCCESS<DeptTreeType[]>>('/dept/auth/list', {
    method: 'GET',
  });
}

/**
 * 新增部门
 */
export function createDept(data: OperationDeptDTO) {
  return request('/dept', {
    method: 'POST',
    data,
  });
}
/**
 * 修改部门
 */
export function updateDept(id: number, data: OperationDeptDTO) {
  return request('/dept/' + id, {
    method: 'PATCH',
    data,
  });
}
/**
 * 删除部门
 */
export function deleteDept(id: number) {
  return request('/dept/' + id, {
    method: 'DELETE',
  });
}

/**
 * 创建用户
 */
export function createUser(data: OperationUserDTO) {
  return request('/user', {
    method: 'POST',
    data,
  });
}
/**
 * 更新用户
 */
export function updateUser(id: number, data: OperationUserDTO) {
  return request('/user/' + id, {
    method: 'PATCH',
    data,
  });
}
/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return request('/user/' + id, {
    method: 'DELETE',
  });
}

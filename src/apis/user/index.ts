/*
 * @Author: mmmmmmmm
 * @Date: 2022-02-28 18:45:08
 * @Description: 文件描述
 */

import { request } from 'umi';
import type { LoginDTO, UserInfo } from './typings';

/**@name 登入 */
export function login(data: LoginDTO) {
  return request('/user/login', {
    method: 'POST',
    data,
  });
}
/**@name 登出 */
export function logout() {
  return request('/user/logout', {
    method: 'GET',
  });
}

/**
 * 获取当前用户信息(需要携带token才有效)
 */
export function getCurrentUser() {
  return request('/user/current/info', { method: 'GET' });
}
export function updateCurrentUser(data: Partial<UserInfo>) {
  return request('/user/account/user-info', { method: 'PATCH', data });
}
export function updateCurrentUserPassword(data: { newPassword: string; oldPassword: string }) {
  return request('/user/account/user-password', { method: 'PATCH', data });
}

export function updateAvatar(file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<RESULT_SUCCESS<string>>('/user/account/avatar', {
    method: 'POST',
    data: form,
  });
}

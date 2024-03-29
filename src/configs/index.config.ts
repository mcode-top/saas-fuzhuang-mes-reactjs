/*
 * @Author: mmmmmmmm
 * @Date: 2022-02-28 18:41:20
 * @Description: 文件描述
 */

export const WEB_SOCKET_URL =
  window.location.host.search('localhost') !== -1
    ? 'ws://localhost:4000'
    : 'ws://121.40.228.54/fz-saas';

console.log('====================================');
console.log(window.location.host);
console.log('====================================');
/**@name 接口地址 */
export const WEB_REQUEST_URL =
  window.location.host.search('localhost') !== -1
    ? 'http://' + window.location.host
    : 'http://121.40.228.54';

/**
 * 租户IDsession存储位置
 */
export const TENANT_SESSION_PATH = 'TENANT_SESSION';
/**
 * 租户鉴权token
 */
export const TENANT_HEADER_TOKEN = 'token';
/**
 * 租户请求头ID
 */
export const TENANT_HEADER = 'x-tenant-id';

/**
 * 登录页地址
 */
export const LOGIN_PATH = '/user/login';

/**@name 常用接口前缀 */
export const REQUEST_PREFIX = '/v1/api';
/**
 * 公用的ProTable updatedAt
 */
export const COM_PRO_TABLE_TIME = {
  updatedAt: [
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt.form',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ] as any,
  createdAt: [
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt.form',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ] as any,
};

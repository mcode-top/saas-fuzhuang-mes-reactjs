/*
 * @Author: mmmmmmmm
 * @Date: 2022-02-28 18:41:20
 * @Description: 文件描述
 */
export const WEB_SOCKET_URL = 'ws://localhost:4000';
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
      width: 150,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt.form',
      valueType: 'dateRange',
      width: 150,
      hideInTable: true,
    },
  ] as any,
  createdAt: [
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 150,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt.form',
      valueType: 'dateRange',
      hideInTable: true,
      width: 150,
    },
  ] as any,
};

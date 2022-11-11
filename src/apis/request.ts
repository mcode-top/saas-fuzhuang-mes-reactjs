/*
 * @Author: mmmmmmmm
 * @Date: 2022-02-28 18:49:22
 * @Description: 文件描述
 */

import {
  LOGIN_PATH,
  TENANT_HEADER,
  TENANT_SESSION_PATH,
  TENANT_HEADER_TOKEN,
  REQUEST_PREFIX,
} from '@/configs/index.config';
import _ from 'lodash';
import { useRequest, RequestConfig, history } from 'umi';
import type { RequestInterceptor, RequestOptionsInit, ResponseInterceptor } from 'umi-request';
// export const request = useRequest()

const apiWhiteList = ['/user/login'];

export const requestInterceptors: RequestInterceptor[] = [
  (orginUrl: string, options: RequestOptionsInit) => {
    let url = '';
    let headers = {
      [TENANT_HEADER]: sessionStorage.getItem(TENANT_SESSION_PATH),
    };
    if (!apiWhiteList.includes(orginUrl)) {
      const token = sessionStorage.getItem(TENANT_HEADER_TOKEN);
      if (!token) {
        history.push(LOGIN_PATH);
      }
      headers[TENANT_HEADER_TOKEN] = token;
    }
    const prefix = REQUEST_PREFIX;
    if (orginUrl.indexOf('http://') === 0 || orginUrl.indexOf('https://') === 0) {
      url = orginUrl;
    } else {
      url = prefix + orginUrl;
    }
    headers = _.merge(headers, options.headers);
    return {
      url,
      options: <RequestOptionsInit>{
        ...options,
        headers,
      },
    };
  },
];

export const responseInterceptors: ResponseInterceptor[] = [
  async (response, options: RequestOptionsInit) => {
    return response;
  },
];

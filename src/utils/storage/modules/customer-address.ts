/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import {
  fetchCurrentCustomerAddressList,
  fetchCurrentCustomerContacterList,
} from '@/apis/business/customer';
import { getAllUsers } from '@/apis/comm';
import { STORAGE_CUSTOMER_ADDRESS_LIST, STORAGE_USER_LIST } from '@/configs/storage.config';
import { arrayToObject } from '@/utils';

export const key = STORAGE_CUSTOMER_ADDRESS_LIST;

export async function loader(companyId: number) {
  const result = (await fetchCurrentCustomerAddressList(companyId)).data;
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', (next) => next),
  };
}

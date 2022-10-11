/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 客户公司
 */

import { fetchCustomerCompanyList } from '@/apis/business/customer';
import { getAllUsers } from '@/apis/comm';
import { STORAGE_CUSTOMER_COMPANY_LIST } from '@/configs/storage.config';

export const key = STORAGE_CUSTOMER_COMPANY_LIST;

export async function loader() {
  const result = (await fetchCustomerCompanyList()).data;
  return {
    data: result,
  };
}

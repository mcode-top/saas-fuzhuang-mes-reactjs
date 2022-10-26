import { request } from 'umi';
import type {
  BusCustomerAddressType,
  BusCustomerCompanyType,
  BusCustomerContacterType,
} from './typing';

/**@name 创建客户公司 */
export function fetchCreateCustomerCompany(data: Omit<BusCustomerCompanyType, 'id'>) {
  return request<RESULT_SUCCESS<any>>('/customer/company', {
    method: 'POST',
    data,
  });
}

/**@name 修改客户公司 */
export function fetchUpdateCustomerCompany(data: BusCustomerCompanyType) {
  return request<RESULT_SUCCESS<any>>('/customer/company', {
    method: 'PATCH',
    data,
  });
}
/**@name 删除客户公司 */
export function fetchRemoveCustomerCompany(id: number) {
  return request<RESULT_SUCCESS<any>>('/customer/remove-company/' + id, {
    method: 'POST',
  });
}

/**@name 创建客户联系人 */
export function fetchCreateCustomerContacter(data: Omit<BusCustomerContacterType, 'id'>) {
  return request<RESULT_SUCCESS<any>>('/customer/contacter', {
    method: 'POST',
    data,
  });
}

/**@name 修改客户联系人 */
export function fetchUpdateCustomerContacter(data: BusCustomerContacterType) {
  return request<RESULT_SUCCESS<any>>('/customer/contacter', {
    method: 'PATCH',
    data,
  });
}
/**@name 删除客户联系人 */
export function fetchRemoveCustomerContacter(id: number) {
  return request<RESULT_SUCCESS<any>>('/customer/remove-contacter/' + id, {
    method: 'POST',
  });
}

/**@name 创建客户地址 */
export function fetchCreateCustomerAddress(data: Omit<BusCustomerAddressType, 'id'>) {
  return request<RESULT_SUCCESS<any>>('/customer/address', {
    method: 'POST',
    data,
  });
}

/**@name 修改客户地址 */
export function fetchUpdateCustomerAddress(data: BusCustomerAddressType) {
  return request<RESULT_SUCCESS<any>>('/customer/address', {
    method: 'PATCH',
    data,
  });
}
/**@name 删除客户地址 */
export function fetchRemoveCustomerAddress(id: number) {
  return request<RESULT_SUCCESS<any>>('/customer/remove-address/' + id, {
    method: 'POST',
  });
}

/**@name 获取全部客户信息 */
export function fetchCustomerCompanyList() {
  return request<RESULT_SUCCESS<BusCustomerCompanyType[]>>('/customer/company-list', {
    method: 'GET',
  });
}
/**@name 获取当前客户全部联系人 */
export function fetchCurrentCustomerContacterList(id: number) {
  return request<RESULT_SUCCESS<BusCustomerContacterType[]>>('/customer/contacter-list/' + id, {
    method: 'GET',
  });
}

/**@name 获取当前客户全部地址 */
export function fetchCurrentCustomerAddressList(id: number) {
  return request<RESULT_SUCCESS<BusCustomerAddressType[]>>('/customer/address-list/' + id, {
    method: 'GET',
  });
}

/**@name 批量导入客户信息 */
export function fetchManyExportExcelCustomer(data: Omit<BusCustomerCompanyType, 'id'>[]) {
  return request<RESULT_SUCCESS<any>>('/customer/many/customer', {
    method: 'POST',
    data,
  });
}
/**@name 批量导入客户联系人 */
export function fetchManyExportExcelContacter(
  companyId: number,
  data: Omit<BusCustomerContacterType, 'id'>[],
) {
  return request<RESULT_SUCCESS<any>>('/customer/many/contacter/' + companyId, {
    method: 'POST',
    data,
  });
}
/**@name 批量导入客户地址 */
export function fetchManyExportExcelAddress(
  companyId: number,
  data: Omit<BusCustomerAddressType, 'id'>[],
) {
  return request<RESULT_SUCCESS<any>>('/customer/many/address/' + companyId, {
    method: 'POST',
    data,
  });
}

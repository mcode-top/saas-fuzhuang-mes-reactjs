import { request } from 'umi';
import type { ApproveContractDto, BusOrderContract, ContractToProcessPageQuery } from './typing';

/**@name 创建合同单 */
export function fetchCreateContract(data: BusOrderContract) {
  return request<RESULT_SUCCESS<any>>('/contract', {
    method: 'POST',
    data,
  });
}
/**@name 更新合同单 */
export function fetchUpdateContract(data: BusOrderContract) {
  return request<RESULT_SUCCESS<any>>('/contract', {
    method: 'PATCH',
    data,
  });
}

/**@name 审核合同单 */
export function fetchApproveContract(data: ApproveContractDto) {
  return request<RESULT_SUCCESS<any>>('/contract/approve', {
    method: 'PATCH',
    data,
  });
}

/**@name 合同单分页 */
export function fetchContractList(data: PAGINATION_QUERY.Param<ContractToProcessPageQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusOrderContract>>>('/contract/page', {
    method: 'POST',
    data,
  });
}
/**@name 删除合同单 */
export function fetchRemoveContract(contractNumber: string) {
  return request<RESULT_SUCCESS<any>>('/contract/remove/' + contractNumber, {
    method: 'POST',
  });
}
/**@name 查看合同单 */
export function fetchWatchContract(contractNumber: string) {
  return request<RESULT_SUCCESS<BusOrderContract>>('/contract/watch/' + contractNumber, {
    method: 'GET',
  });
}
/**@name 查找与物料编码相关的款式信息 */
export function fetchMaterialToStyleDemandData(materialCode: string) {
  return request<RESULT_SUCCESS<{ styleDemandData?: any; manufactureData?: any }>>(
    '/contract/find/style/' + materialCode,
    {
      method: 'GET',
    },
  );
}
/**@name 添加成衣款式内容 */
export function fetchAddProductMaterialStyleDemand(materialCode: string, data: any) {
  return request<RESULT_SUCCESS>('/contract/add/product/' + materialCode, {
    method: 'POST',
    data,
  });
}
/**@name 出纳确认 */
export function fetchConfirmCollectionContract(contractNumber: string) {
  return request<RESULT_SUCCESS>('/contract/apprvoe/collection/' + contractNumber, {
    method: 'POST',
  });
}
/**@name 获取合同流水号 */
export function fetchContractSerialNumber() {
  return request<RESULT_SUCCESS<string>>('/contract/serial-number', {
    method: 'GET',
  });
}

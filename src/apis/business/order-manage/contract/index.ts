import type { ActProcess } from '@/apis/process/typings';
import { request } from 'umi';
import type {
  ApproveContractDto,
  ApprvoeSampleSendDto,
  BusOrderContract,
  BusOrderContractGoodsEntity,
  BusOrderContractOrderAddDto,
  BusOrderTypeEnum,
  ContractToProcessPageQuery,
  CreateSampleSendDto,
  UpdateSampleSendDto,
} from './typing';

/**@name 创建合同单 */
export function fetchCreateContract(data: BusOrderContract) {
  return request<RESULT_SUCCESS<any>>('/contract', {
    method: 'POST',
    data,
  });
}

/**@name 创建合同单-加单 */
export function fetchCreateOrderAddContract(data: BusOrderContractOrderAddDto) {
  return request<RESULT_SUCCESS<any>>('/contract/add-order', {
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
/**@name 样品单分页 */
export function fetchSamplePageList(data: PAGINATION_QUERY.Param<ContractToProcessPageQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusOrderContract>>>(
    '/contract/sample/page',
    {
      method: 'POST',
      data,
    },
  );
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
/**@name 通过部分合同号获取已完成合同列表 */
export function fetchContractNumberToDoneList(contractNumber: string, types?: BusOrderTypeEnum[]) {
  return request<RESULT_SUCCESS<{ contractNumber: string; process: ActProcess }[]>>(
    '/contract/part/' + contractNumber,
    {
      method: 'GET',
      params: {
        types,
      },
    },
  );
}
/**@name 通过合同号查找货品入库表 */
export function fetchFindContractNumberToGoodsList(contractNumber: string) {
  return request<RESULT_SUCCESS<BusOrderContractGoodsEntity[]>>(
    '/contract/contract-goods/' + contractNumber,
    {
      method: 'GET',
    },
  );
}

/**@name 创建样品单(打样) */
export function fetchCreateProofingOrder(data: BusOrderContract) {
  return request<RESULT_SUCCESS>('/contract/sample-proofing/create', {
    method: 'POST',
    data,
  });
}
/**@name 创建寄样单 */
export function fetchCreateSampleSend(data: CreateSampleSendDto) {
  return request<RESULT_SUCCESS>('/contract/sample-send/create', {
    method: 'POST',
    data,
  });
}
/**@name 修改寄样单 */
export function fetchUpdateSampleSend(contractNumber: string, data: UpdateSampleSendDto) {
  return request<RESULT_SUCCESS>('/contract/sample-send/' + contractNumber, {
    method: 'Patch',
    data,
  });
}
/**@name 审核寄样单 */
export function fetchApproveSampleSennd(data: ApprvoeSampleSendDto) {
  return request<RESULT_SUCCESS>('/contract/sample-send/approve', {
    method: 'POST',
    data,
  });
}

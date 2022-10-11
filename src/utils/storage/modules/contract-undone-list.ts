/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 客户联系人
 */

import { fetchUndoneContractList } from '@/apis/business/order-manage/order-process';
import { STORAGE_UNDONE_CONTRACT_NUMBER_LIST } from '@/configs/storage.config';

export const key = STORAGE_UNDONE_CONTRACT_NUMBER_LIST;

export async function loader(params: { partContractNumber: string }) {
  const result = (await fetchUndoneContractList(params.partContractNumber)).data;
  return {
    data: result,
  };
}

/*
 * @Author: mmmmmmmm
 * @Date: 2022-10-29 20:10:01
 * 仓库列表
 */

import { fetchWarehouseIdToShelfList, fetchWarehouseList } from '@/apis/business/warehouse';
import { STORAGE_WAREHOUSE_SHLEF_LIST } from '@/configs/storage.config';

export const key = STORAGE_WAREHOUSE_SHLEF_LIST;

export async function loader(shelfId: number) {
  const result = (await fetchWarehouseIdToShelfList(shelfId)).data;
  return {
    data: result,
  };
}

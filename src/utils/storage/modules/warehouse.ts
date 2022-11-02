/*
 * @Author: mmmmmmmm
 * @Date: 2022-10-29 20:10:01
 * 仓库列表
 */

import { fetchWarehouseList } from '@/apis/business/warehouse';
import { STORAGE_WAREHOUSE_LIST } from '@/configs/storage.config';

export const key = STORAGE_WAREHOUSE_LIST;

export async function loader() {
  const result = (await fetchWarehouseList()).data;
  return {
    data: result,
  };
}

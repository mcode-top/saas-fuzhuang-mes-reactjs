import { arrayToObject } from '@/utils';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import { STORAGE_STATION_LIST } from "@/configs/storage.config";
import { fetchNameListStation } from '@/apis/business/techology-manage/station';

export const key = STORAGE_STATION_LIST;

export async function loader() {
  const result = (await fetchNameListStation()).data
  console.log('====================================');
  console.log(arrayToObject(result, 'id', 'name'));
  console.log('====================================');
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name')
  }
}

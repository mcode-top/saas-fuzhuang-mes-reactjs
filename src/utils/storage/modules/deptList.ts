import { arrayToObject } from '@/utils';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import { getAllDepts } from "@/apis/comm";
import { STORAGE_DEPT_LIST } from "@/configs/storage.config";

export const key = STORAGE_DEPT_LIST;

export async function loader() {
  const result = (await getAllDepts()).data
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name')
  }
}

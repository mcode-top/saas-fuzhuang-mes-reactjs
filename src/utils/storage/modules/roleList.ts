import { arrayToObject } from '@/utils';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import { getAllRoles } from "@/apis/comm";
import { STORAGE_ROLE_LIST } from "@/configs/storage.config";

export const key = STORAGE_ROLE_LIST;

export async function loader() {
  const result = (await getAllRoles()).data
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name')
  }
}

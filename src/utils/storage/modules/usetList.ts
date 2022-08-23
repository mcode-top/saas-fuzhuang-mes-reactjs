/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import { getAllUsers } from "@/apis/comm";
import { STORAGE_USER_LIST } from "@/configs/storage.config";
import { arrayToObject } from "@/utils";

export const key = STORAGE_USER_LIST;

export async function loader() {
  const result = (await getAllUsers()).data;
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name')
  }
}

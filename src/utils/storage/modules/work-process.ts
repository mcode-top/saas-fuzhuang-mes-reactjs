import { arrayToObject } from '@/utils';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import { STORAGE_WORK_PROCESS_LIST } from "@/configs/storage.config";
import { fetchNameListWorkProcess } from '@/apis/business/techology-manage/work-process';

export const key = STORAGE_WORK_PROCESS_LIST;

export async function loader() {
  const result = (await fetchNameListWorkProcess()).data
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name')
  }
}

import { arrayToObject } from '@/utils';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:10:01
 * 用户名列
 */

import { STORAGE_SIZE_TEMPLATE_LIST } from "@/configs/storage.config";
import { fetchNameListWorkProcess } from '@/apis/business/techology-manage/work-process';
import { fetchNameListSizeTemplateParent } from '@/apis/business/techology-manage/size-template';

export const key = STORAGE_SIZE_TEMPLATE_LIST;

export async function loader() {
  const result = (await fetchNameListSizeTemplateParent()).data
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name')
  }
}

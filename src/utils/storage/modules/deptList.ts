import { arrayToObject } from '@/utils';

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

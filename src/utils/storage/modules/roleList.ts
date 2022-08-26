import { arrayToObject } from '@/utils';

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

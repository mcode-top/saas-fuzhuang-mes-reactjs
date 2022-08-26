
import { fetchNameListMaterial } from '@/apis/business/techology-manage/material';
import { STORAGE_MATERIAL_LIST } from '@/configs/storage.config';

export const key = STORAGE_MATERIAL_LIST;

export async function loader(search) {
  const result = (await fetchNameListMaterial(search)).data
  return {
    data: result,
  }
}

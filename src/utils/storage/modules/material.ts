import type { BusMaterialTypeEnum } from '@/pages/business/techology-manage/Material/typing';
import { fetchNameListMaterial } from '@/apis/business/techology-manage/material';
import { STORAGE_MATERIAL_LIST } from '@/configs/storage.config';

export const key = STORAGE_MATERIAL_LIST;

export async function loader(params: { search: string; type: BusMaterialTypeEnum }) {
  const result = (await fetchNameListMaterial(params)).data;
  return {
    data: result,
  };
}

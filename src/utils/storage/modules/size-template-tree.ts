import { arrayToObject } from '@/utils';

import { STORAGE_SIZE_TEMPLATE_TREE } from '@/configs/storage.config';
import { fetchTressSizeTemplate } from '@/apis/business/techology-manage/size-template';

export const key = STORAGE_SIZE_TEMPLATE_TREE;

export async function loader() {
  const result = (await fetchTressSizeTemplate()).data;
  return {
    data: result,
  };
}

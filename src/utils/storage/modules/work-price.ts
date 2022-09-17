import { arrayToObject } from '@/utils';

import { fetchNameListSizeTemplateParent } from '@/apis/business/techology-manage/size-template';
import { STORAGE_WORK_PRICE_LIST } from '@/configs/storage.config';
import { fetchNameListWorkPrice } from '@/apis/business/techology-manage/work-price';

export const key = STORAGE_WORK_PRICE_LIST;

export async function loader() {
  const result = (await fetchNameListWorkPrice()).data;
  return {
    data: result,
  };
}

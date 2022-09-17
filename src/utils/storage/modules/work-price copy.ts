import { arrayToObject } from '@/utils';

import { fetchNameListSizeTemplateParent } from '@/apis/business/techology-manage/size-template';
import { STORAGE_WORK_PRICE_CONTENT, STORAGE_WORK_PRICE_LIST } from '@/configs/storage.config';
import {
  fetchNameListWorkPrice,
  fetchWatchWorkPrice,
} from '@/apis/business/techology-manage/work-price';

export const key = STORAGE_WORK_PRICE_CONTENT;

export async function loader(id) {
  const result = (await fetchWatchWorkPrice(id)).data;

  return {
    data: result.data,
  };
}

import { arrayToObject } from '@/utils';

import { STORAGE_STATION_LIST } from '@/configs/storage.config';
import { fetchNameListStation } from '@/apis/business/techology-manage/station';

export const key = STORAGE_STATION_LIST;

export async function loader() {
  const result = (await fetchNameListStation()).data;
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name'),
  };
}

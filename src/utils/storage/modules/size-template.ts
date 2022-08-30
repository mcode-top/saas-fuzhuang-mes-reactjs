import { arrayToObject } from '@/utils';

import { STORAGE_SIZE_TEMPLATE_LIST } from '@/configs/storage.config';
import { fetchNameListSizeTemplateParent } from '@/apis/business/techology-manage/size-template';

export const key = STORAGE_SIZE_TEMPLATE_LIST;

export async function loader() {
  const result = (await fetchNameListSizeTemplateParent()).data;
  return {
    data: result,
    serachRecord: arrayToObject(result, 'id', 'name'),
  };
}

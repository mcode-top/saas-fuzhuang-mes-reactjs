import { cloneDeep } from 'lodash';
import { arrayToObject, traverseTree } from '@/utils';

import { STORAGE_SIZE_TEMPLATE_TREE } from '@/configs/storage.config';
import { fetchTressSizeTemplate } from '@/apis/business/techology-manage/size-template';

export const key = STORAGE_SIZE_TEMPLATE_TREE;

export async function loader() {
  const result = (await fetchTressSizeTemplate()).data;
  const deep = cloneDeep(result);
  traverseTree(deep, (value, parent) => {
    if (parent) {
      value.label = parent.label + '/' + value.label;
    }
    return value;
  });
  return {
    data: result,
    titleParentTree: deep,
  };
}

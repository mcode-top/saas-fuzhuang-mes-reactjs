import { STORAGE_MATERIAL_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import { throttle } from 'lodash';
import React from 'react';
import type { BusMaterialTypeEnum } from '../typing';

/**@name 选择物料 */
const BusMaterialSelect: React.FC<
  ProFormSelectProps & { multiple?: boolean; materialType?: BusMaterialTypeEnum }
> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
        mode: props?.multiple ? 'multiple' : undefined,
        showSearch: true,
      }}
      request={async (params: { keyWords: string | undefined }) => {
        if (params.keyWords && params.keyWords.length > 3) {
          const { data } = await getList(params.keyWords, props.materialType);
          return data;
        } else {
          return [];
        }
      }}
    />
  );
};

const getList = throttle(
  async function (keyWords, type?: BusMaterialTypeEnum) {
    return await storageDataSource.getValue(STORAGE_MATERIAL_LIST, true, {
      search: keyWords,
      type,
    });
  },
  1000,
  { leading: true },
);

export default BusMaterialSelect;

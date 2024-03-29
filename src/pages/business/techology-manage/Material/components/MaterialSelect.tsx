import { STORAGE_MATERIAL_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import type { CaptFieldRef } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import { throttle } from 'lodash';
import React from 'react';
import type { BusMaterialTypeEnum } from '../typing';

/**@name 选择物料 */
const BusMaterialSelect: React.FC<
  ProFormSelectProps & {
    multiple?: boolean;
    materialType?: BusMaterialTypeEnum;
    serachLength?: number;
    onChangeName?: (value, name) => void;
  }
> = (props) => {
  const serachLength = props?.serachLength || 1;
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
        mode: props?.multiple ? 'multiple' : undefined,
        showSearch: true,
        onChange: (value, option) => {
          if (!Array.isArray(option) && option) {
            const name = /(?<=\()\S+(?=\))/g.exec(option.label as string)?.[0];
            props?.onChangeName?.(value, name);
          }
          props.fieldProps?.onChange?.(value, option);
        },
      }}
      request={async (params: { keyWords: string | undefined }, props1) => {
        if (props1.fieldProps.value && props1.mode === 'read') {
          params.keyWords = props1.fieldProps.value;
        }
        if (
          (params.keyWords && params.keyWords.length > serachLength) ||
          (props1.fieldProps.value.length > serachLength && props1.mode === 'read')
        ) {
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
